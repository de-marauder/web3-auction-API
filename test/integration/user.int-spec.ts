import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { DatabaseService } from 'src/database/service/database.service';
import { UserService } from 'src/user/service/user.service';
import { AuthService } from 'src/auth/service/auth.service';
import { UserDocument } from 'src/user/schema/user.schema';
import { TokenService } from 'src/token/service/token.service';

describe('User module (integration tests)', () => {
  let app: INestApplication;
  let db: DatabaseService;
  let authService: AuthService;
  let userService: UserService;
  let tokenService: TokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.get<INestApplication>(AppModule);
    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    tokenService = module.get<TokenService>(TokenService);
    db = module.get<DatabaseService>(DatabaseService);
    await db.cleanDataBase();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  describe('register()', () => {
    const verificationCode = '124321';
    const userDto = {
      email: 'email@example.com',
      password: '<PASSWORD>',
    };

    let user: UserDocument;

    it('should create a user', async () => {
      user = await authService.register({
        ...userDto,
        code: verificationCode,
      });
      expect(user).toBeDefined();
      expect(user.email).toEqual(userDto.email);
    });
    it('user should not be verified', () => {
      expect(user.verificationCode).toBeTruthy();
      expect(user.activated).toBeFalsy();
    });
  });

  describe('verifyUser()', () => {
    const verificationCode = '124321';
    const userDto = {
      email: 'email@example.com',
      password: '<PASSWORD>',
    };

    let user: UserDocument;
    let token: string;

    it('should verify a user', async () => {
      user = await authService.register({
        ...userDto,
        code: verificationCode,
      });
      expect(user).toBeDefined();
      expect(user.email).toEqual(userDto.email);

      user = await userService.verify({
        email: user.email,
        code: +user.verificationCode,
      });
      expect(user.verificationCode).toBeFalsy();
      expect(user.activated).toBeTruthy();
      expect(user.activated).toBeTruthy();
    });
    it('should create a JWT', async () => {
      token = await tokenService.signToken({
        id: user.id,
        email: user.email,
        username: user.username,
      });
      expect(token).toBeDefined();
      expect(tokenService.decode(token).payload).toMatchObject({
        id: user.id,
        email: user.email,
        username: user.username,
      });
    });
  });

  describe('login()', () => {
    const verificationCode = '124321';
    const userDto = {
      email: 'email@example.com',
      password: '<PASSWORD>',
    };

    let user: UserDocument | void;

    it('should log a user in', async () => {
      user = await authService.register({
        ...userDto,
        code: verificationCode,
      });
      expect(user).toBeDefined();
      expect(user.email).toEqual(userDto.email);

      user = await userService.verify({
        email: user.email,
        code: +user.verificationCode,
      });
      expect(user.verificationCode).toBeFalsy();
      expect(user.activated).toBeTruthy();

      user = await authService.verifyPassword({
        email: user.email,
        password: userDto.password,
      });

      expect(user).toBeDefined();
    });

    it('should throw a BadRequest if password incorrect', async () => {
      user = await authService.register({
        ...userDto,
        code: verificationCode,
      });
      expect(user).toBeDefined();
      expect(user.email).toEqual(userDto.email);

      user = await authService
        .verifyPassword({
          email: user.email,
          password: 'wrong.password',
        })
        .catch((error) => {
          expect(error.status).toBe(400);
        });

      expect(user).toBeUndefined();
    });
  });

  describe('logout()', () => {
    const verificationCode = '124321';
    const userDto = {
      email: 'email@example.com',
      password: '<PASSWORD>',
    };

    let user: UserDocument | void;

    it('should log a user out', async () => {
      user = await authService.register({
        ...userDto,
        code: verificationCode,
      });
      expect(user).toBeDefined();
      expect(user.email).toEqual(userDto.email);

      user = await userService.verify({
        email: user.email,
        code: +user.verificationCode,
      });
      expect(user.verificationCode).toBeFalsy();
      expect(user.activated).toBeTruthy();

      await authService.logout(user.id);
      user = await userService.findOneOrErrorOut({
        email: user.email,
      });
      expect(user.loggedIn).toBeFalsy();
    });
  });
});
