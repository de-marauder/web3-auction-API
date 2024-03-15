import { Injectable, Logger } from '@nestjs/common';
import { UserService } from 'src/user/service/user.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private userService: UserService) { }

  async register() { }

  async login() { }

  async logout() { }
}
