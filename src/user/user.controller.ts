import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { TokenPayloadParam } from 'src/auth/params/token-payload.param';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('User')
@Controller('api/user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto, description: 'User data to create a new user' })
  async create(@Body() createUserDto: CreateUserDto) {
    this.logger.log('Attempting to create user with data:', JSON.stringify(createUserDto));
    try {
      const result = await this.userService.create(createUserDto);
      this.logger.log('User creation successful. Result:', JSON.stringify(result));
      return result;
    } catch (error) {
      this.logger.error('User creation failed with error:', error.message);
      throw error;
    }
  }

  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'Get a list of all users' })
  async findAll() {
    this.logger.log('Attempting to retrieve all users');
    try {
      const result = await this.userService.findAll();
      this.logger.log('User retrieval successful. Result:', JSON.stringify(result));
      return result;
    } catch (error) {
      this.logger.error('Failed to retrieve users with error:', error.message);
      throw error;
    }
  }

  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth()
  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'ID of the user to retrieve' })
  async findOne(@Param('id') id: string) {
    this.logger.log(`Attempting to retrieve user with ID: ${id}`);
    try {
      const result = await this.userService.findOne(+id);
      this.logger.log('User retrieval successful. Result:', JSON.stringify(result));
      return result;
    } catch (error) {
      this.logger.error(`Failed to retrieve user with ID ${id}. Error:`, error.message);
      throw error;
    }
  }

  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'ID of the user to update' })
  @ApiBody({ type: UpdateUserDto, description: 'User data to update an existing user' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    this.logger.log(`Attempting to update user with ID: ${id} with data:`, JSON.stringify(updateUserDto));
    try {
      const result = await this.userService.update(+id, updateUserDto, tokenPayload);
      this.logger.log('User update successful. Result:', JSON.stringify(result));
      return result;
    } catch (error) {
      this.logger.error(`User update failed for ID ${id} with error:`, error.message);
      throw error;
    }
  }

  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'ID of the user to delete' })
  async remove(
    @Param('id') id: string,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    this.logger.log(`Attempting to delete user with ID: ${id}`);
    try {
      const result = await this.userService.remove(+id, tokenPayload);
      this.logger.log('User deletion successful. Result:', JSON.stringify(result));
      return result;
    } catch (error) {
      this.logger.error(`Failed to delete user with ID ${id}. Error:`, error.message);
      throw error;
    }
  }
}
