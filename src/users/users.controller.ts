import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService, User } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() user: User) {
    this.usersService.create(user);
    return 'Usuário criado!';
  }

  @Get()
  findAll(): User[] {
    return this.usersService.findAll();
  }
}
