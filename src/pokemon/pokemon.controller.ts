// src/pokemon/pokemon.controller.ts
import { Controller, Get, Post, Param, Query, Delete, NotFoundException } from '@nestjs/common';
import { PokemonService } from './pokemon.service';

@Controller('api/pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Post(':name')
  async createPokemon(@Param('name') name: string) {
    return this.pokemonService.fetchAndStorePokemonData(name);
  }

  @Get()
  async findAll(@Query('limit') limit = 20, @Query('offset') offset = 0) {
    return this.pokemonService.findAllPaginated(+limit, +offset);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.pokemonService.findOne(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.pokemonService.delete(id);
  }

  @Get('search/:name')
  async searchByName(@Param('name') name: string) {
    const result = await this.pokemonService.findByName(name);
    if (result.pokemon) {
      return { pokemon: result.pokemon, suggestions: [] };
    } else if (result.suggestions.length > 0) {
      return { suggestions: result.suggestions };
    } else {
      throw new NotFoundException('Pokémon not found and no suggestions available');
    }
  }

  @Get('suggestions/:partialName')
  async getSuggestions(@Param('partialName') partialName: string) {
  const result = await this.pokemonService.findByName(partialName);
  if (result.suggestions.length > 0) {
    return { suggestions: result.suggestions };
  } else {
    throw new NotFoundException('No suggestions available');
  }
}
}
