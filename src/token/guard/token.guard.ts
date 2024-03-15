import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
import { TokenDataDto } from '../dto/token.dto';
import { UserService } from 'src/user/service/user.service';

@Injectable()
export class TokenMiddlewareGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UserService,
  ) { }
  async canActivate(context: ExecutionContext) {
    // set by the UseToken decorator
    const useToken = this.reflector.get<boolean>('token', context.getHandler());
    if (!useToken) return true;

    try {
      const response: Response = context.switchToHttp().getResponse();
      const tokenData = response.locals.tokenData as TokenDataDto;

      if (!tokenData) {
        throw new NotFoundException('authorization token not found');
      }

      const user = await this.userService.findOneSelectAndPopulateOrErrorOut(
        { email: tokenData.email },
        'loggedIn',
      );
      if (!user.loggedIn) {
        throw new ForbiddenException('Token Invalid. User logged out');
      }

      return true;
    } catch (e) {
      if (e instanceof HttpException) throw e;
      throw new BadRequestException(e.message);
    }
  }
}
