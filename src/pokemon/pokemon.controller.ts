import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { PokemonsService } from './pokemons.service';
import { Pokemon } from './pokemon.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('pokemon')
@Controller('api/pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonsService) {}

  @Post(':name')
  async createPokemon(@Param('name') name: string): Promise<Pokemon> {
    return this.pokemonService.fetchAndStorePokemonData(name);
  }

  @Get()
  async findAll(): Promise<Pokemon[]> {
    return this.pokemonService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Pokemon> {
    return this.pokemonService.findOne(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.pokemonService.delete(id);
  }
}
