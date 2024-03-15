import { Controller, Delete, Logger, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  @Post('register')
  async register() { }

  @Post('login')
  async login() { }

  @Delete('logout')
  async logout() { }
}
