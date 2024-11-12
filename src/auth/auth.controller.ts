import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('Authentication') // Define a tag 'Authentication' para organizar os endpoints
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @ApiOperation({ summary: 'Authenticate user and generate access tokens' }) // Descrição do endpoint de login
  @ApiBody({ type: LoginDto, description: 'User login credentials' }) // Define o corpo da requisição como LoginDto
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access tokens using a refresh token' }) // Descrição do endpoint de refresh
  @ApiBody({ type: RefreshTokenDto, description: 'Refresh token for obtaining new access tokens' }) // Define o corpo da requisição como RefreshTokenDto
  refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto);
  }
}
