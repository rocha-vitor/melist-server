import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { errors } from '../http/errors';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      return this.schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          code: errors.validationFailed,
          errors: fromZodError(error).details,
        });
      }

      throw new BadRequestException({
        code: errors.validationFailed,
      });
    }
  }
}
