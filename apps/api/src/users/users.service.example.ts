import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { type User, type Prisma } from '@repo/database';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    return this.prisma.client.user.findMany({
      include: {
        posts: true,
      },
    });
  }

  async findOne(id: string): Promise<User | null> {
    return this.prisma.client.user.findUnique({
      where: { id },
      include: {
        posts: true,
      },
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.client.user.create({
      data,
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.client.user.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<User> {
    return this.prisma.client.user.delete({
      where: { id },
    });
  }
}
