import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CheckoutCreatedDto } from '../dto';

@Controller()
export class CheckoutBusMessageController {
    constructor(
        private readonly logger: Logger,
    ) { }
}
