import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HashingService } from 'src/auth/hashing/hashing.service';

import * as path from 'path';
import * as fs from 'fs/promises';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';

@Injectable({ scope: Scope.DEFAULT })
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const passwordHash = await this.hashingService.hash(
        createUserDto.password,
      );

      const userData = {
        name: createUserDto.name,
        passwordHash,
        email: createUserDto.email,
      };

      const novaPessoa = this.userRepository.create(userData);
      await this.userRepository.save(novaPessoa);
      return novaPessoa;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('E-mail já está cadastrado.');
      }

      throw error;
    }
  }

  async findAll() {
    const users = await this.userRepository.find({
      order: {
        id: 'desc',
      },
    });

    return users;
  }

  async findOne(id: number) {
    const pessoa = await this.userRepository.findOneBy({
      id,
    });

    if (!pessoa) {
      throw new NotFoundException('Pessoa não encontrada');
    }

    return pessoa;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    tokenPayload: TokenPayloadDto,
  ) {
    const userData = {
      name: updateUserDto?.name,
    };

    if (updateUserDto?.password) {
      const passwordHash = await this.hashingService.hash(
        updateUserDto.password,
      );

      userData['passwordHash'] = passwordHash;
    }

    const user = await this.userRepository.preload({
      id,
      ...userData,
    });

    if (!user) {
      throw new NotFoundException('Pessoa não encontrada');
    }

    if (user.id !== tokenPayload.sub) {
      throw new ForbiddenException('Você não é essa pessoa.');
    }

    return this.userRepository.save(user);
  }

  async remove(id: number, tokenPayload: TokenPayloadDto) {
    const pessoa = await this.findOne(id);

    if (pessoa.id !== tokenPayload.sub) {
      throw new ForbiddenException('Você não é essa pessoa.');
    }

    return this.userRepository.remove(pessoa);
  }

}