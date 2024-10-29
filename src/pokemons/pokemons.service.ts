import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Pokemon } from './pokemon.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PokemonsService {
  private readonly apiUrl = 'https://pokeapi.co/api/v2/pokemon';

  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Pokemon)
    private readonly pokemonRepository: Repository<Pokemon>,
  ) {}

  async fetchPokemonData(pokemonName: string): Promise<AxiosResponse> {
    const response = await this.httpService
      .get(`${this.apiUrl}/${pokemonName}`)
      .toPromise();
    return response.data;
  }

  async fetchAndStorePokemonData(name: string): Promise<Pokemon> {
    const data = await this.httpService
      .get(`https://pokeapi.co/api/v2/pokemon/${name}`)
      .toPromise();

    const pokemon = new Pokemon();
    pokemon.name = data.data.name;
    pokemon.imageUrl = data.data.sprites.front_default; 
    pokemon.attack = data.data.moves[0].move.name;

    return await this.pokemonRepository.save(pokemon);
  }

  async findAll(): Promise<Pokemon[]> {
    return await this.pokemonRepository.find();
  }

  async findOne(id: number): Promise<Pokemon> {
    return await this.pokemonRepository.findOneBy({ id });
  }

  async update(id: number, data: Partial<Pokemon>): Promise<void> {
    await this.pokemonRepository.update(id, data);
  }

  async delete(id: number): Promise<void> {
    await this.pokemonRepository.delete(id);
  }
}
