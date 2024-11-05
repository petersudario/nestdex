import { ConflictException, Injectable, Param, Post } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Pokemon } from './pokemon.entity';
import { lastValueFrom } from 'rxjs';
import * as stringSimilarity from 'string-similarity'; // Import the library
import axios from 'axios';
import { CreatePokemonDto } from './dto/create-pokemon.dto';

@Injectable()
export class PokemonService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Pokemon)
    private readonly pokemonRepository: Repository<Pokemon>,
  ) {}

async createPokemon(createPokemonDto: CreatePokemonDto): Promise<{ message: string; pokemon?: Pokemon }> {
    const { name, imageUrl, attack } = createPokemonDto;

    // Verifica se o Pokémon já existe na base de dados local
    const existingPokemon = await this.pokemonRepository.findOneBy({ name });

    if (existingPokemon) {
      return {
        message: `O Pokémon ${name} já existe na base de dados local.`,
        pokemon: existingPokemon,
      };
    }

    // Se a requisição vier do formulário do front-end
    if (imageUrl || attack) {
      const customPokemon = new Pokemon();
      customPokemon.name = name;
      customPokemon.imageUrl = imageUrl || ''; // Usa a URL fornecida ou deixa em branco
      customPokemon.attack = attack || 'Custom'; // Usa o ataque fornecido ou coloca como 'Custom'

      const savedCustomPokemon = await this.pokemonRepository.save(customPokemon);

      return {
        message: `O Pokémon ${name} foi criado na base de dados local com base nos dados fornecidos.`,
        pokemon: savedCustomPokemon,
      };
    }

    // Tenta buscar o Pokémon na API externa
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
      const data = response.data;

      const newPokemon = new Pokemon();
      newPokemon.name = data.name;
      newPokemon.imageUrl = data.sprites.front_default;
      newPokemon.attack = data.moves[0]?.move.name || 'N/A';

      const savedPokemon = await this.pokemonRepository.save(newPokemon);

      return {
        message: `O Pokémon ${name} foi inserido na base de dados local. Ele já existia na API.`,
        pokemon: savedPokemon,
      };
    } catch (error) {
      // Se o Pokémon não for encontrado na API, cria um Pokémon personalizado com dados mínimos
      const customPokemon = new Pokemon();
      customPokemon.name = name;
      customPokemon.imageUrl = ''; // Imagem padrão ou vazia
      customPokemon.attack = 'Custom'; // Ataque padrão ou 'Custom'

      const savedCustomPokemon = await this.pokemonRepository.save(customPokemon);

      return {
        message: `O Pokémon ${name} não foi encontrado na API externa, mas foi criado na base de dados local como um Pokémon personalizado.`,
        pokemon: savedCustomPokemon,
      };
    }
  }


  async findAllPaginated(limit: number, offset: number): Promise<Pokemon[]> {
    return await this.pokemonRepository.find({
      skip: offset,
      take: limit,
    });
  }


  async findOne(id: number): Promise<Pokemon> {
    return await this.pokemonRepository.findOneBy({ id });
  }

  async delete(id: number): Promise<void> {
    await this.pokemonRepository.delete(id);
  }

  async findByName(name: string): Promise<{ pokemon?: Pokemon; suggestions: Pokemon[] }> {
    // Busca um Pokémon com nome exato
    let pokemon = await this.pokemonRepository.findOneBy({ name });

    if (pokemon) {
      return { pokemon, suggestions: [] };
    }

    const allPokemon = await this.pokemonRepository.find({
      select: ['name', 'attack', 'imageUrl'], 
    });

    const names = allPokemon.map((p) => p.name);

    const matches = stringSimilarity.findBestMatch(name, names);

    const threshold = 0.4; 
    const matchedNames = matches.ratings
      .filter((rating) => rating.rating >= threshold)
      .sort((a, b) => b.rating - a.rating)
      .map((rating) => rating.target)
      .slice(0, 5); 

    const suggestions = await this.pokemonRepository.find({
      where: { name: In(matchedNames) },
      select: ['name', 'attack', 'imageUrl']
    });

    return { suggestions };
  }


}
