import { Controller, Injectable, UsePipes, Query, Get } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from 'src/infra/pipes/zod-validation-pipe';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';

const findProductshQuerySchema = z.object({
  filter: z
    .string()
    .optional()
    .transform((filter) => {
      if (!filter) {
        return undefined;
      }
      return filter;
    }),
});

type FindProductshQuerySchema = z.infer<typeof findProductshQuerySchema>;

@Injectable()
@Controller('/products')
export class FindProductsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @UsePipes(new ZodValidationPipe(findProductshQuerySchema))
  async handle(@Query() { filter }: FindProductshQuerySchema) {
    const query = {};

    if (filter) {
      Object.assign(query, {
        OR: [
          {
            title: {
              contains: filter,
              mode: 'insensitive',
            },
          },
          {
            brand: {
              contains: filter,
              mode: 'insensitive',
            },
          },
        ],
      });
    }

    const products = await this.prisma.product.findMany({
      where: query,
      orderBy: {
        title: 'asc',
      },
    });

    return {
      products,
    };
  }
}
