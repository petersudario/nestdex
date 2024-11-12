import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PokemonModule } from './pokemon/pokemon.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { User } from './users/user.entity';
import { Pokemon } from './pokemon/pokemon.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'root',
      password: 'root',
      database: 'nestdex',
      entities: [User, Pokemon],
      synchronize: true, 
    }),
    PokemonModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
