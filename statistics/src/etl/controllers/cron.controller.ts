import { Controller, HttpCode, HttpStatus, ForbiddenException, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { environment } from '../../environments';
import { CronService } from '../services';

@Controller('run-cron-job')
@ApiTags('run-cron-job')
export class CronController {
  constructor(
    private readonly cronService: CronService,
  ) { }

  @Post('/')
  @HttpCode(HttpStatus.OK)
  public async runCronJob(): Promise<void> {
    if (environment.production) {
      throw new ForbiddenException(`Production env`);
    }
    await this.cronService.transactions();
  }
}
