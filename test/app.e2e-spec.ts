import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ParseIntPipe, ValidationPipe } from '@nestjs/common';
import { DatabaseConnectionService } from '../src/database_connection/database_connection.service';
import { get } from 'http';
import * as pactum from 'pactum';
import { AuthDto } from '@app/auth/dto';
import * as argon from 'argon2';
describe('App e2e', () => {
  let app: INestApplication;
  let prisma: DatabaseConnectionService;
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
  });
  afterAll(() => {
    app.close();
  });
  describe('Auth', () => {
    describe('Signup', () => {
      it('should signup', async () => {
        // Define the DTO for signup
        const dto: AuthDto = {
          id: 1,
          username: 'usertest',
          email: 'test@gmail.com',
          password: 'passwordtesting',
          profile: null,
          createdAt: new Date(), // Should be a Date instance
          updatedAt: new Date(), // Should be a Date instance
        };

        // Send a POST request to the signup endpoint with the provided DTO
        return pactum
          .spec()
          .post('http://localhost:3333/auth/signup')
          .withBody(dto)
          .expectStatus(201).toss;
      });
    });
    describe('Signin', () => {
      it.todo('should signin');
    });
  });
  describe('User', () => {
    describe('Get current user', () => {});
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
function now(): Date {
  throw new Error('Function not implemented.');
}

