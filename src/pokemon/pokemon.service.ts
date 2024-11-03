// src/pokemon/pokemon.service.ts
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pokemon } from './pokemon.entity';
import { lastValueFrom } from 'rxjs';

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
}
