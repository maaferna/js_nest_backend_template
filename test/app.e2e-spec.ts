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
import { EditUserDto } from '../src/user/dto';
import { CreateBookDto } from '../src/book/dto';
import { CreateBookStatusDto } from '../src/user_book_status/dto/create-book-status.dto';
import { UserBookStatusService } from '../src/user_book_status/user_book_status.service';

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
    describe('Create book', () => {
      it('should create two books with authors and categories', async () => {
        const authHeaders = {
          Authorization: 'Bearer $S{userAt}',
        };

        // Create an author
        const createAuthorDto = {
          name: 'John Doe Jr',
        };
        const authorResponse = await pactum
          .spec()
          .post('/authors')
          .withJson(createAuthorDto)
          .withHeaders(authHeaders)
          .expectStatus(201);

        const author2Id = authorResponse.body.id;
        const authorId = 1;
        // Create categories
        const category1Dto = {
          name: 'Category 3',
        };
        const category2Dto = {
          name: 'Category 4',
        };

        const category1Response = await pactum
          .spec()
          .post('/categories')
          .withHeaders(authHeaders)
          .withJson(category1Dto)
          .expectStatus(201);

        const category2Response = await pactum
          .spec()
          .post('/categories')
          .withHeaders(authHeaders)
          .withJson(category2Dto)
          .expectStatus(201);

        const categoryIds = [
          category1Response.body.id,
          category2Response.body.id,
        ];

        // Create books with authors and categories
        const book1Dto = new CreateBookDto();
        book1Dto.title = 'Book 1';
        book1Dto.isbn = '1244567890';
        book1Dto.pageCount = 200;
        book1Dto.publishedDate = '2023-11-15T12:00:00Z';
        book1Dto.thumbnailUrl = 'https://example.com/book1-thumbnail';
        book1Dto.shortDescription = 'Short description for Book 1';
        book1Dto.longDescription = 'Long description for Book 1';
        book1Dto.status = 'Available';
        book1Dto.authors = [1]; // Replace with valid author IDs
        book1Dto.categories = [1, 2, 3]; // Replace with valid category IDs

        const book2Dto = new CreateBookDto();
        book2Dto.title = 'Book 2';
        book2Dto.isbn = '0947654321';
        book2Dto.pageCount = 150;
        book2Dto.publishedDate = '2023-11-16T12:00:00Z';
        book2Dto.thumbnailUrl = 'https://example.com/book2-thumbnail';
        book2Dto.shortDescription = 'Short description for Book 2';
        book2Dto.longDescription = 'Long description for Book 2';
        book2Dto.status = 'Available';
        book2Dto.authors = [1, 2]; // Replace with valid author IDs
        book2Dto.categories = [3, 4]; // Replace with valid category IDs

        await pactum
          .spec()
          .post('/books')
          .withHeaders(authHeaders)
          .withJson(book1Dto)
          .expectStatus(201);

        await pactum
          .spec()
          .post('/books')
          .withHeaders(authHeaders)
          .withJson(book2Dto)
          .expectStatus(201);
      });
    });
    describe('Get book by id', () => {
      it('should get a book by id', async () => {
        // Assume you have an existing book ID
        const existingBookId = 1;

        // Fetch the book from the database
        const existingBook = await prisma.book.findUnique({
          where: { id: existingBookId },
          include: {
            authors: true,
            categories: true,
          },
        });

        // Convert date objects to strings for comparison
        const expectedBook = JSON.parse(JSON.stringify(existingBook));
        console.log(expectedBook);

        // Make the request using the existing book ID and compare with the actual book data
        await pactum
          .spec()
          .get(`/books/${existingBookId}`)
          .expectStatus(200)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectJson(expectedBook as any); // Replace this with your assertion logic
      });

      it('should handle not found book by id', async () => {
        const nonExistentBookId = 999;

        // Make the request using a non-existent book ID
        await pactum
          .spec()
          .get(`/books/${nonExistentBookId}`)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(404);
      });
    });
    describe('Edit book', () => {});
    describe('Delete book', () => {});
  });
  describe('User profile', () => {
    describe('Create profile', () => {});
    describe('Get profile', () => {});
    describe('Edit profile', () => {});
  });
  describe('BookStatus API Tests', () => {
    describe('Create BookStatus', () => {
      it('should create a book status for a user', async () => {
        const userId = 1; // replace with a valid user ID
        const createBookStatusDto: CreateBookStatusDto = {
          bookId: 1, // replace with a valid book ID
          wantToRead: true,
          currentlyRead: false,
        };
        console.log('Test - createBookStatusDto:', createBookStatusDto);

        // Add log statements before Pactum request setup
        console.log('Before Pactum Request Setup');

        // Wrap Pactum setup in a Promise
        await new Promise<void>((resolve) => {
          pactum
            .spec()
            .post(`/users/${userId}/book-statuses`)
            .withHeaders({
              Authorization: 'Bearer $S{userAt}',
            })
            .withJson(createBookStatusDto)
            .expectStatus(201)
            .toss();

          // Add a timeout to ensure the logs are printed after the Pactum request setup
          setTimeout(() => {
            console.log('After Pactum Request Setup');
            resolve();
          }, 0);
        });
      });

      describe('Get BookStatus', () => {
        it('should get book statuses for a user', () => {
          const userId = 1; // replace with a valid user ID

          return pactum
            .spec()
            .get(`/users/${userId}/book-statuses`)
            .withHeaders({
              Authorization: 'Bearer $S{userAt}',
            })
            .expectStatus(200);
        });
      });
    });
  });
});
