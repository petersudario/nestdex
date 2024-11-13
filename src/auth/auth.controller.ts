import { Body, Controller, Post, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('Authentication')
@Controller('api/auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post()
  @ApiOperation({ summary: 'Authenticate user and generate access tokens' })
  @ApiBody({ type: LoginDto, description: 'User login credentials' })
  async login(@Body() loginDto: LoginDto) {
    this.logger.log('Attempting login with data:', JSON.stringify(loginDto));
    try {
      const result = await this.authService.login(loginDto);
      this.logger.log('Login successful. Result:', JSON.stringify(result));
      return result;
    } catch (error) {
      this.logger.error('Login failed with error:', error.message);
      throw error;
    }
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access tokens using a refresh token' })
  @ApiBody({ type: RefreshTokenDto, description: 'Refresh token for obtaining new access tokens' })
  async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    this.logger.log('Attempting token refresh with data:', JSON.stringify(refreshTokenDto));
    try {
      const result = await this.authService.refreshTokens(refreshTokenDto);
      this.logger.log('Token refresh successful. Result:', JSON.stringify(result));
      return result;
    } catch (error) {
      this.logger.error('Token refresh failed with error:', error.message);
      throw error;
    }
  }
}
