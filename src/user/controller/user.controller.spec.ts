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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        TokenService,
        ConfigService,
        {
          provide: getModelToken(User.name),
          useValue: Model<User>,
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
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
