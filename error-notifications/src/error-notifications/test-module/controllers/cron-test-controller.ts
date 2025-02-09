import { Controller, Post, Param, UseGuards, Res } from '@nestjs/common';
import { JwtAuthGuard, Roles, RolesEnum, Acl, AclActionsEnum } from '@pe/nest-kit/modules/auth';
import { constants } from 'http2';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SendNotificationErrorsCron } from '../../cron';
import { CronUpdateIntervalEnum } from '../../enums';

@Controller('cron-test')
@UseGuards(JwtAuthGuard)
@ApiTags('cron-test')
@ApiBearerAuth()
@Roles(RolesEnum.merchant)
export class CronTestController {

  constructor(
    private readonly sendNotificationErrorsCron: SendNotificationErrorsCron,
  ) {
  }

  @Post('update-interval/:updateInterval')
  @Acl({ microservice: 'checkout', action: AclActionsEnum.create })
  public async executeCronActionByCronInterval(
    @Param('updateInterval') updateInterval: CronUpdateIntervalEnum,
    @Res() response: any,
  ): Promise<any>  {
    await this.sendNotificationErrorsCron.sendNotificationErrorsByCronInterval(updateInterval);

    response
      .status(constants.HTTP_STATUS_OK)
      .send('success')
    ;
  }

  @Post('after-interval')
  @Acl({ microservice: 'checkout', action: AclActionsEnum.create })
  public async executeCronActionByAfterInterval(
    @Res() response: any,
  ): Promise<any>  {
    await this.sendNotificationErrorsCron.sendNotificationErrorsByAfterInterval();

    response
      .status(constants.HTTP_STATUS_OK)
      .send('success')
    ;
  }

}
