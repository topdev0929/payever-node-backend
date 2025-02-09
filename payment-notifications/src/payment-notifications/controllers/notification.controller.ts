import { Controller, Get, UseGuards, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccessTokenPayload, JwtAuthGuard, QueryDto, Roles, RolesEnum, User } from '@pe/nest-kit';
import { NotificationFilterRequestDto, NotificationFilterResultDto } from '../dto';
import { NotificationService } from '../services';

@Controller('notification')
@ApiTags('Payment Notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Roles(RolesEnum.merchant, RolesEnum.oauth)
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
  ) { }

  @Get('')
  public async getNotifications(
    @QueryDto() filter: NotificationFilterRequestDto,
    @User() user: AccessTokenPayload,
  ): Promise<NotificationFilterResultDto> {
    return this.notificationService.getNotifications(user, filter);
  }

  @Get('payment/:paymentId')
  public async getNotificationsOfSinglePayment(
    @Param('paymentId') paymentId: string,
    @User() user: AccessTokenPayload,
  ): Promise<NotificationFilterResultDto> {
    return this.notificationService.getNotificationByPaymentId(paymentId, user);
  }
}
