import { Controller, Get, Post, Param, Query, Delete, NotFoundException, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { PokemonService } from './pokemon.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { Pokemon } from './pokemon.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('pokemons')
@Controller('api/pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Cria um novo Pokémon' })
  @ApiBody({ type: CreatePokemonDto })
  @ApiResponse({ status: 201, description: 'Pokémon criado com sucesso', type: Pokemon })
  @ApiResponse({ status: 409, description: 'O Pokémon já existe' })
  async createPokemon(@Body() createPokemonDto: CreatePokemonDto) {
    return await this.pokemonService.createPokemon(createPokemonDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retorna uma lista paginada de Pokémons' })
  @ApiQuery({ name: 'limit', required: false, description: 'Número de registros a serem retornados', example: 20 })
  @ApiQuery({ name: 'offset', required: false, description: 'Número de registros a serem ignorados', example: 0 })
  @ApiResponse({ status: 200, description: 'Lista de Pokémons retornada com sucesso', type: [Pokemon] })
  async findAll(@Query('limit') limit = 20, @Query('offset') offset = 0) {
    return this.pokemonService.findAllPaginated(+limit, +offset);
  }


  @Get(':id')
  @ApiOperation({ summary: 'Retorna um Pokémon pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do Pokémon' })
  @ApiResponse({ status: 200, description: 'Pokémon encontrado', type: Pokemon })
  @ApiResponse({ status: 404, description: 'Pokémon não encontrado' })
  async findOne(@Param('id') id: number) {
    return this.pokemonService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deleta um Pokémon pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do Pokémon a ser deletado' })
  @ApiResponse({ status: 200, description: 'Pokémon deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Pokémon não encontrado' })
  async delete(@Param('id') id: number) {
    return this.pokemonService.delete(id);
  }

  @Get('search/:name')
  @ApiOperation({ summary: 'Busca um Pokémon pelo nome' })
  @ApiParam({ name: 'name', description: 'Nome do Pokémon a ser buscado' })
  @ApiResponse({ status: 200, description: 'Pokémon encontrado ou sugestões retornadas', type: Pokemon })
  @ApiResponse({ status: 404, description: 'Pokémon não encontrado e sem sugestões' })
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
  @ApiOperation({ summary: 'Retorna sugestões de Pokémons com base em um nome parcial' })
  @ApiParam({ name: 'partialName', description: 'Parte do nome do Pokémon para buscar sugestões' })
  @ApiResponse({ status: 200, description: 'Sugestões de Pokémons encontradas', type: [Pokemon] })
  @ApiResponse({ status: 404, description: 'Nenhuma sugestão disponível' })
  async getSuggestions(@Param('partialName') partialName: string) {
    const result = await this.pokemonService.findByName(partialName);
    if (result.suggestions.length > 0) {
      return { suggestions: result.suggestions };
    } else {
      throw new NotFoundException('No suggestions available');
    }
  }
}
