import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User, UserDocument } from '../schema/user.schema';

describe('UserService', () => {
  let service: UserService;
  let mockUserModel: Model<UserDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: {
            create: jest.fn().mockImplementation((dto) => {
              // Model.create accepts an object and returns a Document object
              const user = new User();
              user.username = dto.username;
              user.email = dto.email;
              user.password = dto.password;
              user.avatar = dto.avatar;
              return Promise.resolve(user);
            }),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    mockUserModel = module.get<Model<UserDocument>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const newUser = {
      username: 'John Doe',
      email: 'john.doe@example.com',
      password: '<PASSWORD>',
      avatar: 'http://example.com',
      verificationCode: '123456',
    };
    const createdUser = await service.createUser(newUser);

    delete newUser.verificationCode;
    expect(mockUserModel.create).toHaveBeenCalledWith(newUser); // Verify mock call
    expect(createdUser).toEqual(expect.objectContaining(newUser)); // Expect partial match
  });
});
