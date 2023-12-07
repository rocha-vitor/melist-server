import {
  Body,
  Controller,
  Injectable,
  Delete,
  UsePipes,
  Request,
  BadRequestException,
  HttpCode,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from 'src/infra/pipes/zod-validation-pipe';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { errors } from '../errors';

const deleteListBodySchema = z.object({
  listId: z.string().uuid(),
});

type DeleteListBodySchema = z.infer<typeof deleteListBodySchema>;

@Injectable()
@Controller('/lists')
export class DeleteListController {
  constructor(private readonly prisma: PrismaService) {}

  @Delete()
  @HttpCode(204)
  @UsePipes(new ZodValidationPipe(deleteListBodySchema))
  async handle(@Request() request: any, @Body() body: DeleteListBodySchema) {
    const { sub } = request.user;
    const { listId } = body;

    const list = await this.prisma.list.findUnique({ where: { id: listId } });

    if (!list || list.owner_id !== sub) {
      throw new BadRequestException({
        code: errors.resourceNotFound,
        msg: 'list does not exists',
      });
    }

    await this.prisma.list.delete({
      where: {
        id: list.id,
      },
    });
  }
}
