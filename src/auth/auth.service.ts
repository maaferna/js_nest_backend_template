import { Injectable, Post } from '@nestjs/common';
import { DatabaseConnectionService } from 'src/database_connection/database_connection.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';

@Injectable({})
export class AuthService {
  constructor(private prisma: DatabaseConnectionService) {}

  async signup(dto: AuthDto) {
    // Generate the password hash
    const hash = await argon.hash(dto.password);
    const user = await this.prisma.user.create({
      data: {
        username: dto.username,
        email: dto.email,
        hash,
        profile: dto.profile,
        createdAt: dto.createdAt,
        updatedAt: dto.updatedAt,
      },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
      },
    });

    // Save the new user in the database

    // Return the new user
    return user;
  }

  signin() {
    return { msg: 'I have signed in' };
  }
}
