import { Model } from 'mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from '../service/user.service';
import { User } from '../schema/user.schema';
import { TokenService } from 'src/token/service/token.service';
import { envValidator } from 'src/env/validator/env.validator';

describe('UserController', () => {
  let controller: UserController;
  let mockUserService: UserService;
  const testCreateUserDto = {
    email: 'johndoe@gmail.com',
    password: '<PASSWORD>',
    username: '',
    avatar: 'http://example.com',
  };
  const user = new User();
  user.email = testCreateUserDto.email;
  user.password = testCreateUserDto.password;
  user.avatar = testCreateUserDto.avatar;
  user.username = testCreateUserDto.username || `user-xxxx`;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        TokenService,
        ConfigService,
        {
          provide: getModelToken(User.name),
          useValue: {
            findOne: jest.fn().mockResolvedValue(user),
          },
        },
      ],
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: ['.env.test'],
          validationSchema: envValidator,
        }),
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    mockUserService = module.get<UserService>(UserService);
  });

  describe('Verify user', () => {
    beforeEach(async () => {
      mockUserService.findOneSelectAndPopulateOrErrorOut = jest
        .fn()
        .mockResolvedValue({
          ...user,
          verificationCode: '1234',
          save: jest.fn().mockResolvedValue(user),
        });
    });
    it('should return token', async () => {
      const verificationDetails = { email: 'johndoe@gmail.com', code: 1234 };
      const result = await controller.verifyUser(verificationDetails);
      expect(result).toBeDefined();
      expect(result.token).toBeDefined();
    });
    it('should return activated user', async () => {
      const verificationDetails = { email: 'johndoe@gmail.com', code: 1234 };

      const result = await controller.verifyUser(verificationDetails);
      expect(result).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.user.activated).toBe(true);
    });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
