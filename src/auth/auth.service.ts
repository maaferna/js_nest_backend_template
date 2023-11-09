import { ForbiddenException, Injectable, Post } from '@nestjs/common';
import { DatabaseConnectionService } from 'src/database_connection/database_connection.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { error } from 'console';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: DatabaseConnectionService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: AuthDto) {
    // Generate the password hash
    const hash = await argon.hash(dto.password);
    // Save the new user in the database
    try {
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

      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }

    // Return the new user
  }

  async signin(dto: AuthDto) {
    // find the user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    // if user does not exist throw exception
    if (!user) throw new ForbiddenException('Email incorrecto');
    // compare password, if incorrect throw exception
    const pwMathes = await argon.verify(user.hash, dto.password);
    if (!pwMathes) throw new ForbiddenException('Contraseña incorrecta');

    return this.signToken(user.id, user.email);
  }
  signToken(userId: number, email: string): Promise<string> {
    const payload = {
      sub: userId,
      email,
    };

    const secret = this.config.get('JWT_SECRET');
    return this.jwt.signAsync(payload, {
      expiresIn: '15min',
      secret: secret,
    }); // This is a function from JWT token
  }
}
