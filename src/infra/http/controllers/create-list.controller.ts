import {
  Body,
  Controller,
  Injectable,
  Post,
  UsePipes,
  Request,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from 'src/infra/pipes/zod-validation-pipe';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';

const createListBodySchema = z.object({
  name: z.string().min(1),
  items: z
    .array(
      z.object({
        product_id: z.string().uuid(),
        qty: z.number().int().min(1),
      }),
    )
    .min(1)
    .optional(),
});

type CreateListBodySchema = z.infer<typeof createListBodySchema>;

@Injectable()
@Controller('/lists')
export class CreateListController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createListBodySchema))
  async handle(@Request() request: any, @Body() body: CreateListBodySchema) {
    const { sub } = request.user;
    const { name, items: itemsToCreate } = body;

    const list = await this.prisma.list.create({
      data: {
        name,
        owner_id: sub,
        items: itemsToCreate
          ? {
              createMany: {
                data: itemsToCreate.map((item) => ({
                  product_id: item.product_id,
                  qty: item.qty,
                })),
              },
            }
          : undefined,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return { list };
  }
}
