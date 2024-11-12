import { Repository } from 'typeorm';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';

import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs/promises';

jest.mock('fs/promises'); // Mocka o módulo fs

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;
  let hashingService: HashingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            save: jest.fn(),
            create: jest.fn(),
            findOneBy: jest.fn(),
            find: jest.fn(),
            preload: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: HashingService,
          useValue: {
            hash: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    hashingService = module.get<HashingService>(HashingService);
  });

  it('userService deve estar definido', () => {
    expect(userService).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um novo usuário', async () => {
      const createUserDto: CreateUserDto = {
        email: 'luiz@email.com',
        name: 'Luiz',
        password: '123456',
      };
      const passwordHash = 'HASHDESENHA';
      const newUser = {
        id: 1,
        name: createUserDto.name,
        email: createUserDto.email,
        passwordHash,
      };

      jest.spyOn(hashingService, 'hash').mockResolvedValue(passwordHash);
      jest.spyOn(userRepository, 'create').mockReturnValue(newUser as any);

      const result = await userService.create(createUserDto);

      expect(hashingService.hash).toHaveBeenCalledWith(createUserDto.password);
      expect(userRepository.create).toHaveBeenCalledWith({
        name: createUserDto.name,
        passwordHash,
        email: createUserDto.email,
      });
      expect(userRepository.save).toHaveBeenCalledWith(newUser);
      expect(result).toEqual(newUser);
    });

    it('deve lançar ConflictException quando e-mail já existe', async () => {
      jest.spyOn(userRepository, 'save').mockRejectedValue({ code: '23505' });

      await expect(userService.create({} as any)).rejects.toThrow(
        ConflictException,
      );
    });

    it('deve lançar um erro genérico quando um erro for lançado', async () => {
      jest
        .spyOn(userRepository, 'save')
        .mockRejectedValue(new Error('Erro genérico'));

      await expect(userService.create({} as any)).rejects.toThrow(
        new Error('Erro genérico'),
      );
    });
  });

  describe('findOne', () => {
    it('deve retornar um usuário se encontrado', async () => {
      const userId = 1;
      const foundUser = {
        id: userId,
        name: 'Luiz',
        email: 'luiz@email.com',
        passwordHash: '123456',
      };

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(foundUser as any);

      const result = await userService.findOne(userId);

      expect(result).toEqual(foundUser);
    });

    it('deve lançar um erro se o usuário não for encontrado', async () => {
      await expect(userService.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('deve retornar todos os usuários', async () => {
      const usersMock: User[] = [
        {
          id: 1,
          name: 'Luiz',
          email: 'luiz@email.com',
          passwordHash: '123456',
        } as User,
      ];

      jest.spyOn(userRepository, 'find').mockResolvedValue(usersMock);

      const result = await userService.findAll();

      expect(result).toEqual(usersMock);
      expect(userRepository.find).toHaveBeenCalledWith({
        order: {
          id: 'desc',
        },
      });
    });
  });

  describe('update', () => {
    it('deve atualizar um usuário se autorizado', async () => {
      const userId = 1;
      const updateUserDto = { name: 'Joana', password: '654321' };
      const tokenPayload = { sub: userId } as any;
      const passwordHash = 'HASHDESENHA';
      const updatedUser = { id: userId, name: 'Joana', passwordHash };

      jest.spyOn(hashingService, 'hash').mockResolvedValueOnce(passwordHash);
      jest.spyOn(userRepository, 'preload').mockResolvedValue(updatedUser as any);
      jest.spyOn(userRepository, 'save').mockResolvedValue(updatedUser as any);

      const result = await userService.update(userId, updateUserDto, tokenPayload);

      expect(hashingService.hash).toHaveBeenCalledWith(updateUserDto.password);
      expect(userRepository.preload).toHaveBeenCalledWith({
        id: userId,
        name: updateUserDto.name,
        passwordHash,
      });
      expect(userRepository.save).toHaveBeenCalledWith(updatedUser);
      expect(result).toEqual(updatedUser);
    });

    it('deve lançar ForbiddenException se usuário não autorizado', async () => {
      const userId = 1;
      const tokenPayload = { sub: 2 } as any;
      const updateUserDto = { name: 'Jane Doe' };
      const existingUser = { id: userId, name: 'John Doe' };

      jest.spyOn(userRepository, 'preload').mockResolvedValue(existingUser as any);

      await expect(
        userService.update(userId, updateUserDto, tokenPayload),
      ).rejects.toThrow(ForbiddenException);
    });

    it('deve lançar NotFoundException se o usuário não existe', async () => {
      const userId = 1;
      const tokenPayload = { sub: userId } as any;
      const updateUserDto = { name: 'Jane Doe' };

      jest.spyOn(userRepository, 'preload').mockResolvedValue(null);

      await expect(
        userService.update(userId, updateUserDto, tokenPayload),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('deve remover um usuário se autorizado', async () => {
      const userId = 1;
      const tokenPayload = { sub: userId } as any;
      const existingUser = { id: userId, name: 'John Doe' };

      jest.spyOn(userService, 'findOne').mockResolvedValue(existingUser as any);
      jest.spyOn(userRepository, 'remove').mockResolvedValue(existingUser as any);

      const result = await userService.remove(userId, tokenPayload);

      expect(userService.findOne).toHaveBeenCalledWith(userId);
      expect(userRepository.remove).toHaveBeenCalledWith(existingUser);
      expect(result).toEqual(existingUser);
    });

    it('deve lançar ForbiddenException se não autorizado', async () => {
      const userId = 1;
      const tokenPayload = { sub: 2 } as any;
      const existingUser = { id: userId, name: 'John Doe' };

      jest.spyOn(userService, 'findOne').mockResolvedValue(existingUser as any);

      await expect(userService.remove(userId, tokenPayload)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('deve lançar NotFoundException se o usuário não for encontrado', async () => {
      const userId = 1;
      const tokenPayload = { sub: userId } as any;

      jest
        .spyOn(userService, 'findOne')
        .mockRejectedValue(new NotFoundException());

      await expect(userService.remove(userId, tokenPayload)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

});
