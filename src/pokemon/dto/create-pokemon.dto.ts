import { IsString, IsOptional } from 'class-validator';

export class CreatePokemonDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  attack?: string;
}
