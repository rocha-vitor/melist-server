import {
  Body,
  Controller,
  Injectable,
  Put,
  UsePipes,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from 'src/infra/pipes/zod-validation-pipe';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { errors } from '../errors';

const updateListBodySchema = z.object({
  listId: z.string().uuid(),
  name: z.string().min(1).optional(),
  itemsToRemove: z.array(z.string().uuid()).min(1).optional(),
  itemsToUpdate: z
    .array(
      z.object({
        item_id: z.string().uuid(),
        qty: z.number().int().min(1),
      }),
    )
    .min(1)
    .optional(),
  itemsToAdd: z
    .array(
      z.object({
        product_id: z.string().uuid(),
        qty: z.number().int().min(1),
      }),
    )
    .min(1)
    .optional(),
});

type UpdateListBodySchema = z.infer<typeof updateListBodySchema>;

@Injectable()
@Controller('/lists')
export class UpdateListController {
  constructor(private readonly prisma: PrismaService) {}

  @Put()
  @UsePipes(new ZodValidationPipe(updateListBodySchema))
  async handle(@Request() request: any, @Body() body: UpdateListBodySchema) {
    const { sub } = request.user;
    const { listId, name, itemsToRemove, itemsToUpdate, itemsToAdd } = body;

    const list = await this.prisma.list.findUnique({
      where: { id: listId },
      include: { participants: true },
    });

    if (
      !list ||
      list.owner_id !== sub ||
      !list.participants.find(({ account_id }) => account_id === sub)
    ) {
      throw new BadRequestException({
        code: errors.resourceNotFound,
        msg: 'list does not exists',
      });
    }

    if (name) {
      await this.prisma.list.update({
        where: {
          id: list.id,
        },
        data: {
          name,
        },
      });
    }

    if (itemsToRemove) {
      await this.prisma.listItem.deleteMany({
        where: {
          id: {
            in: itemsToRemove,
          },
        },
      });
    }

    if (itemsToUpdate) {
      await Promise.all(
        itemsToUpdate.map(async ({ item_id, qty }) =>
          this.prisma.listItem.update({
            where: {
              id: item_id,
            },
            data: {
              qty,
            },
          }),
        ),
      );
    }

    if (itemsToAdd) {
      await this.prisma.listItem.createMany({
        data: itemsToAdd.map(({ product_id, qty }) => ({
          list_id: list.id,
          product_id,
          qty,
        })),
      });
    }

    const listUpdated = await this.prisma.list.findUnique({
      where: {
        id: list.id,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return {
      list: listUpdated,
    };
  }
}
