import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ParseIntPipe, ValidationPipe } from '@nestjs/common';
import { DatabaseConnectionService } from '../src/database_connection/database_connection.service';
import { get } from 'http';

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
    prisma = app.get(DatabaseConnectionService);
    await prisma.cleanDb();
  });
  afterAll(() => {
    app.close();
  });
  it.todo('should');
});
