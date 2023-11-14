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
import { EditUserDto } from '@app/user/dto';

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
          .expectStatus(200);
      });
    });
    describe('Edit user', () => {
      it('should edit user', () => {
        const userId = 1;
        const dto: EditUserDto = {
          id: Number(userId),
          username: 'Marco Antonio',
        };
        return pactum
          .spec()
          .patch(`/users/${userId}`) // Include the user ID in the URL
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200);
      });
    });
  });
  describe('Author', () => {
    describe('Create author', () => {
      it('should create an author', async () => {
        const createAuthorDto = {
          name: 'John Doe',
        };
        return pactum
          .spec()
          .post('/authors')
          .withJson(createAuthorDto)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(201);
      });
    });
    describe('Get author', () => {});
  });
  describe('Category', () => {
    describe('Create category', () => {
      it('should create two categories', async () => {
        // Assuming you have a valid authentication token in userAt
        const authHeaders = {
          Authorization: 'Bearer $S{userAt}',
        };

        // Define DTOs for creating categories
        const category1Dto = {
          name: 'Category 1',
        };

        const category2Dto = {
          name: 'Category 2',
        };

        // Create the first category
        await pactum
          .spec()
          .post('/categories')
          .withHeaders(authHeaders)
          .withJson(category1Dto)
          .expectStatus(201);

        // Create the second category
        await pactum
          .spec()
          .post('/categories')
          .withHeaders(authHeaders)
          .withJson(category2Dto)
          .expectStatus(201);
      });
    });
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
