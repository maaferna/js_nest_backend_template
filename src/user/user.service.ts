import { DatabaseConnectionService } from '../database_connection/database_connection.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: DatabaseConnectionService) {}
  async editUser(userId: number, dto: EditUserDto) {
    console.log('UserId:', userId);
    const existingUser = await this.prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!existingUser) {
      // Handle the case where the user is not found, return an error or do something else
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const user = await this.prisma.user.update({
      where: { id: Number(userId) },
      data: {
        ...dto,
        id: Number(userId), // You may omit this line if Prisma automatically takes care of it
        profile: {
          update: dto.profile,
        },
      },
    });

    delete user.hash;
    return user;
  }
}
