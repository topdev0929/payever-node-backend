import { BadRequestException } from '@nestjs/common';
export class EntityExistsException extends BadRequestException {
  constructor(message: string) {
    super(message);
  }
}
