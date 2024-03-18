import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ObjectSchema, StringSchema } from 'joi';

@Injectable()
export class ObjectValidationPipe implements PipeTransform {
  constructor(private readonly schema: ObjectSchema) { }
  async transform(
    data: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    try {
      return this.schema.validateAsync(data, {
        stripUnknown: true,
      });
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}

@Injectable()
export class StringValidationPipe implements PipeTransform {
  constructor(private readonly schema: StringSchema) { }
  async transform(data: string): Promise<string> {
    try {
      const value = await this.schema.validateAsync(data);
      return value;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
