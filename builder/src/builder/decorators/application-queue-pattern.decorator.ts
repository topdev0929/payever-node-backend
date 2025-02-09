import { MessagePattern } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
import { environment } from '../../environments';

dotenv.config();

export function ApplicationQueuePattern(metadata?: any): MethodDecorator {
  if (!process.env.APPLICATION_QUEUE_PREFIX) {
    throw new Error(`Environment variable "APPLICATION_QUEUE_PREFIX" is not set`);
  }

  metadata.channel = environment.rabbitChannel;
  metadata.name = `${process.env.APPLICATION_QUEUE_PREFIX}.${metadata.name}`;

  return MessagePattern(metadata);
}
