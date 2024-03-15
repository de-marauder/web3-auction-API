import {
  BadRequestException,
  Injectable,
  Logger,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../service/token.service';
import { UserService } from 'src/user/service/user.service';

@Injectable()
export class TokenMiddleware implements NestMiddleware {
  private readonly logger = new Logger(TokenMiddleware.name);

  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
  ) { }
  async use(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization?.startsWith('Bearer')) {
      throw new BadRequestException('valid authorization token is required');
    }
    const authorizationHeader = req.headers.authorization;
    const [, token] = authorizationHeader.split(' ');

    if (!token) {
      throw new BadRequestException('please provide a valid JWT token');
    }

    const tokenData = await this.tokenService.verifyToken(token);

    // token data is not valid
    if (!tokenData) {
      throw new BadRequestException('please provide a valid JWT token');
    }

    await this.userService.findByIdOrErrorOut(tokenData.id);

    res.locals.tokenData = tokenData;
    next();
  }
}
