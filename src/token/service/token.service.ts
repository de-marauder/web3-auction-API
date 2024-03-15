import * as jwt from 'jsonwebtoken';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenDataDto } from './../dto/token.dto';
import { ConfigService } from '@nestjs/config';
import { EnvConfigEnum } from 'src/config/env.enum';
import { Errors } from 'src/utils/enums/utils.enums';

@Injectable()
export class TokenService {
  private _YEAR: number = 365 * 24 * 60 * 60 * 1000; // 1 year
  private expiresIn: number;
  private tokenSecret: jwt.Secret;

  constructor(private config: ConfigService) {
    const expiresIn = parseInt(
      this.config.getOrThrow(EnvConfigEnum.JWT_EXPIRE),
      10,
    );
    this.tokenSecret = config.getOrThrow(EnvConfigEnum.TOKEN_SECRET);
    this.expiresIn = !isNaN(expiresIn) ? expiresIn : this._YEAR;
  }

  signToken({ id, email, username }: TokenDataDto): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(
        { id, email, username },
        this.tokenSecret,
        { expiresIn: this.expiresIn },
        (err, encoded: string) => {
          if (err) reject(new InternalServerErrorException(err));
          resolve(encoded);
        },
      );
    });
  }

  verifyToken(token: string): Promise<TokenDataDto> {
    return new Promise((resolve) => {
      jwt.verify(
        token,
        this.tokenSecret,
        { ignoreExpiration: false },
        (err, decoded: TokenDataDto) => {
          if (err) {
            if (err.name === 'TokenExpiredError') {
              throw new UnauthorizedException(Errors.TOKEN_EXPIRED);
            }
            throw new BadRequestException(err.message);
          }
          resolve(decoded);
        },
      );
    });
  }

  decode(token: string) {
    return jwt.decode(token, { complete: true });
  }
}
