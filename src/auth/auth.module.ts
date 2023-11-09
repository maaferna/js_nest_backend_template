import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DatabaseConnectionModule } from '../database_connection/database_connection.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [DatabaseConnectionModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
