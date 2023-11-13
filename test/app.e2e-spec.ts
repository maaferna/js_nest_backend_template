import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ParseIntPipe, ValidationPipe } from '@nestjs/common';
import { DatabaseConnectionService } from '../src/database_connection/database_connection.service';
import { get } from 'http';
import * as pactum from 'pactum';
import { AuthDto, UserProfileDto } from '@app/auth/dto';
import * as argon from 'argon2';
import { ForbiddenException } from '@nestjs/common';
import { AuthService } from '../src/auth/auth.service';

jest.mock('argon2');

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: DatabaseConnectionService;
  let authService: AuthService;
  let prismaMock: any;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    // Try to emulate the app creation
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3333);
    prisma = app.get(DatabaseConnectionService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333');
    authService = moduleRef.get<AuthService>(AuthService);

    prismaMock = {
      user: {
        create: jest.fn(),
      },
    };
  });
  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    describe('Signup', () => {
      it('should signup', async () => {
        // Send a POST request to the signup endpoint with the provided
        // Define the DTO for sign functions
        const mockHash = 'mockedHashValue';
        (argon.hash as jest.Mock).mockResolvedValue(mockHash);
        const signupDto: AuthDto = {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          password: 'testpassword',
          profile: {
            id: 1,
            first_name: 'Marco',
            last_name: 'Parra',
            profile_image: '/path/to/image',
            biography: 'Some text',
            createdAt: '2023-11-13T15:48:40.280Z',
            updatedAt: '2023-11-13T15:48:40.280Z',
          }, // Setting profile to null
          createdAt: '2023-11-13T15:48:40.280Z',
          updatedAt: '2023-11-13T15:48:40.280Z',
        };
        prismaMock.user.create.mockResolvedValue({
          id: 1,
          email: signupDto.email,
          username: signupDto.username,
          createdAt: signupDto.createdAt,
        });
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(signupDto)
          .expectStatus(201)
          .inspect()
          .stores('userAt', 'access_token');
      });
    });
    describe('Signin', () => {
      it('should sign in the user and return access token', async () => {
        const mockUser = {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          hash: 'hashedPassword',
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const mockAuthDto = {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          password: 'testpassword',
          profile: {
            id: 1,
            first_name: 'Marco',
            last_name: 'Parra',
            profile_image: '/path/to/image',
            biography: 'Some text',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        const mockSignTokenResult = { access_token: 'mockAccessToken' };

        jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser);
        jest.spyOn(argon, 'verify').mockResolvedValue(true);
        jest
          .spyOn(authService, 'signToken')
          .mockResolvedValue(mockSignTokenResult);

        const result = await authService.signin(mockAuthDto);

        expect(result).toEqual(mockSignTokenResult);
      });
      it('should throw ForbiddenException if password is incorrect', async () => {
        const mockUser = {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          hash: 'hashedPassword',
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const mockAuthDto = {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          password: 'testpassword',
          profile: {
            id: 1,
            first_name: 'Marco',
            last_name: 'Parra',
            profile_image: '/path/to/image',
            biography: 'Some text',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser);
        jest.spyOn(argon, 'verify').mockResolvedValue(false);

        await expect(authService.signin(mockAuthDto)).rejects.toThrowError(
          ForbiddenException,
        );
      });
    });
  });
  describe('User', () => {
    describe('Get current user', () => {
      it('should get the current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .inspect();
      });
    });
    describe('Edit user', () => {});
  });
  describe('Author', () => {
    describe('Create author', () => {});
    describe('Get author', () => {});
  });
  describe('Category', () => {
    describe('Create category', () => {});
    describe('Get category', () => {});
  });
  describe('Book', () => {
    describe('Create book', () => {});
    describe('Get book by id', () => {});
    describe('Edit book', () => {});
    describe('Delete book', () => {});
  });
  describe('User profile', () => {
    describe('Create profile', () => {});
    describe('Get profile', () => {});
    describe('Edit profile', () => {});
  });
  it.todo('should pass');
});
