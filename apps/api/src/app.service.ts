import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getDbStatus(): Promise<{ status: string; prismaConnected: boolean }> {
    try {
      await this.prisma.client.$connect();
      return { status: 'ok', prismaConnected: true };
    } catch (error) {
      return { status: 'error', prismaConnected: false };
    }
  }
}
