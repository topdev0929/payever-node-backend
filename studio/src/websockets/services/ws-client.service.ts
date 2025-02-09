import { Injectable, Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class WsClientService {
  constructor(
    private readonly logger: Logger,
  ) {
  }
}
