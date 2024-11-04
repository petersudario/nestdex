import { Module } from '@nestjs/common';
import { PokemonController } from './pokemon.controller';
import { PokemonService } from './pokemon.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pokemon } from './pokemon.entity';

@Module({
  imports: [
    HttpModule,             
    TypeOrmModule.forFeature([Pokemon]),
  ],
  controllers: [PokemonController],
  providers: [PokemonService]
})
export class PokemonModule {}
