import { Body, Controller, HttpCode, HttpStatus, Logger, Post } from '@nestjs/common';

import { AutoResponderDto } from '../dto';
import { AutoresponderService } from '../services';

@Controller('/api/v1')
export class AutoresponderController {
  constructor(
    private readonly logger: Logger,
    private readonly autoresponderService: AutoresponderService,
  ) {
  }

  @HttpCode(HttpStatus.OK)
  @Post('/inbound/message')
  public async autoresponder(
    @Body() dto: AutoResponderDto,
  ): Promise<{ message: string }> {
    this.logger.log({ message: `Income request from autoresponder body:`, dto: `${JSON.stringify(dto)}` });
    
    return this.autoresponderService.autoRespond(dto);
  }
}
