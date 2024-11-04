// src/pokemon/pokemon.service.ts
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Pokemon } from './pokemon.entity';
import { lastValueFrom } from 'rxjs';
import * as stringSimilarity from 'string-similarity'; // Import the library

@Injectable()
export class PokemonService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Pokemon)
    private readonly pokemonRepository: Repository<Pokemon>,
  ) {}

  async fetchAndStorePokemonData(name: string): Promise<Pokemon> {
    const response = await lastValueFrom(
      this.httpService.get(`https://pokeapi.co/api/v2/pokemon/${name}`)
    );

    const data = response.data;

    const pokemon = new Pokemon();
    pokemon.name = data.name;
    pokemon.imageUrl = data.sprites.front_default;
    pokemon.attack = data.moves[0].move.name;

    return await this.pokemonRepository.save(pokemon);
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
