import { Controller, Injectable, Get, Request } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';

@Injectable()
@Controller('/lists')
export class FindListsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async handle(@Request() request: any) {
    const { sub } = request.user;

    const lists = await this.prisma.list.findMany({
      where: {
        OR: [
          {
            owner_id: sub,
          },
          {
            participants: {
              some: {
                account_id: sub,
              },
            },
          },
        ],
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        participants: {
          include: {
            participant: true,
          },
        },
      },
    });

    return { lists };
  }
}
