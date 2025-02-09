import { Controller, Delete, Get, HttpCode, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';
import { NotificationService } from '../services';

@Controller('notification')
@ApiTags('notification')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid authorization token.' })
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
export class NotificationsController {
  public constructor(
    private readonly notificationService: NotificationService,
  ) { }

  @Get('/kind/:kind/entity/:entity/app/:app')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK })
  @Roles(RolesEnum.merchant)
  public async list(
    @Param('kind') kind: string,
    @Param('entity') entity: string,
    @Param('app') app: string,
  ): Promise<any> {
    return this.notificationService.findNotifications(
      kind,
      entity,
      app,
    );
  }
}
