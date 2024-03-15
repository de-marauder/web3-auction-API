import { Model } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/service/user.service';
import { User } from 'src/user/schema/user.schema';
import { generateUniqueString } from 'src/utils/functions/utils.functions';
import { BadRequestException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let mockUserModel: Model<User>;

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
  user.username =
    testCreateUserDto.username || `user-${generateUniqueString(4)}`;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: {
            create: jest.fn().mockResolvedValue(user),
            findOne: jest.fn().mockResolvedValue(user),
          },
        },
      ],
    }).compile();
    mockUserModel = module.get<Model<User>>(getModelToken(User.name));
    controller = module.get<AuthController>(AuthController);
  });

  describe('Register', () => {
    it('Should return user object', async () => {
      mockUserModel.findOne = jest.fn().mockResolvedValueOnce(null);
      const { user: u } = await controller.register(testCreateUserDto);
      expect(u).toBeDefined();
      expect(u.username).toBeDefined();
      expect(u.email).toBeDefined();
      expect(u).toMatchObject(user);
    });

    it('Must accept password and email', async () => {
      const tests = [
        {
          email: '',
          password: '',
        },
        {
          email: 'johndoe@gmail.com',
          password: '',
        },
        {
          email: '',
          password: '<PASSWORD>',
        },
      ];
      for (const test of tests) {
        expect(controller.register(test)).rejects.toThrow(BadRequestException);
      }
    });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
