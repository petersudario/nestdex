import { Module } from '@nestjs/common';
import { PokemonController } from './pokemon.controller';
import { PokemonsService } from './pokemons.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pokemon } from './pokemon.entity';

@Module({
  imports: [
    HttpModule,             
    TypeOrmModule.forFeature([Pokemon]),
  ],
  controllers: [PokemonController],
  providers: [PokemonsService]
})
export class PokemonsModule {}
