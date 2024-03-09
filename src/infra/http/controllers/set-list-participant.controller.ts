import {
  Body,
  Controller,
  Injectable,
  UsePipes,
  Request,
  BadRequestException,
  Post,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from 'src/infra/pipes/zod-validation-pipe';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { errors } from '../errors';

const setListParticipantBodySchema = z.object({
  listId: z.string().uuid(),
});

type SetListParticipantBodySchema = z.infer<
  typeof setListParticipantBodySchema
>;

@Injectable()
@Controller('/lists/participants')
export class SetListParticipantController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(setListParticipantBodySchema))
  async handle(
    @Request() request: any,
    @Body() body: SetListParticipantBodySchema,
  ) {
    const { sub } = request.user;
    const { listId } = body;

    const list = await this.prisma.list.findUnique({
      where: { id: listId },
      include: { participants: true },
    });

    if (!list) {
      throw new BadRequestException({
        code: errors.resourceNotFound,
        msg: 'list does not exists',
      });
    }

    if (list.owner_id === sub) {
      throw new BadRequestException({
        code: errors.resourceNotFound,
        msg: 'you cannot set yourself as a list participant from your own list',
      });
    }

    if (list.participants.find(({ account_id }) => account_id === sub)) {
      throw new BadRequestException({
        code: errors.resourceNotFound,
        msg: 'you already are a participant of this list',
      });
    }

    await this.prisma.listParticipant.create({
      data: {
        account_id: sub,
        list_id: listId,
      },
    });
  }
}
