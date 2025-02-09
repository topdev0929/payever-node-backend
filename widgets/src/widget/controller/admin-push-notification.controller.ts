import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { PushNotificationDto } from '../dto';
import { PushNotificationModel } from '../models';
import { PushNotificationSchemaName } from '../schemas';
import { PushNotificationService } from '../services';

const invalidAuthApi: any = { status: 400, description: 'Invalid authorization token.' };
const unauthorizedApi: any = { status: 401, description: 'Unauthorized.' };

@Controller('admin/push-notification')
@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
export class AdminPushNotificationController {

  constructor(
    private readonly pushNotificationService: PushNotificationService,
  ) { }

  @Get('list')
  @ApiResponse({
    isArray: true,
    status: 200,
    type: PushNotificationDto,
  })
  @ApiBearerAuth()
  @ApiResponse(invalidAuthApi)
  @ApiResponse(unauthorizedApi)
  public async getAllPushNotifications(): Promise<PushNotificationDto[]> {
    return this.pushNotificationService.getAll();
  }

  @Get(':id')
  @ApiResponse({ type: PushNotificationDto, status: HttpStatus.OK })
  @ApiBearerAuth()
  @ApiResponse(invalidAuthApi)
  @ApiResponse(unauthorizedApi)
  public async getOnePushNotification(
    @ParamModel({ _id: ':id' }, PushNotificationSchemaName) pushNotification: PushNotificationDto,
    @Param('id') swagger__id: string,
  ): Promise<PushNotificationDto> {
    return pushNotification;
  }

  @Post()
  @ApiResponse({ type: PushNotificationDto, status: HttpStatus.OK })
  @ApiBearerAuth()
  @ApiResponse(invalidAuthApi)
  @ApiResponse(unauthorizedApi)
  public async createPushNotification(
    @Body() dto: PushNotificationDto,
  ): Promise<PushNotificationDto> {
    return this.pushNotificationService.create(dto);
  }

  @Patch(':id')
  @ApiResponse({ type: PushNotificationDto, status: HttpStatus.OK })
  @ApiBearerAuth()
  @ApiResponse(invalidAuthApi)
  @ApiResponse(unauthorizedApi)
  public async updatePushNotification(
    @Param('id') id: string,
    @Body() dto: Partial<PushNotificationDto>,
  ): Promise<PushNotificationDto> {
    return this.pushNotificationService.update(id, dto);
  }

  @Delete(':id')
  @ApiResponse({ type: PushNotificationDto, status: HttpStatus.OK })
  @ApiBearerAuth()
  @ApiResponse(invalidAuthApi)
  @ApiResponse(unauthorizedApi)
  public async deletePushNotification(
    @ParamModel({ _id: ':id' }, PushNotificationSchemaName) pushNotification: PushNotificationModel,
    @Param('id') swagger__id: string,
  ): Promise<PushNotificationDto> {
    return this.pushNotificationService.delete(pushNotification);
  }

  @Post('push/:id')
  @ApiOperation({ description: 'Sends push notification to `global` namespace' })
  @ApiResponse({ type: PushNotificationDto, status: HttpStatus.OK })
  @ApiBearerAuth()
  @ApiResponse(invalidAuthApi)
  @ApiResponse(unauthorizedApi)
  public async sendPushNotification(
    @ParamModel({ _id: ':id' }, PushNotificationSchemaName) pushNotification: PushNotificationModel,
    @Param('id') swagger__id: string,
  ): Promise<PushNotificationDto> {
    return this.pushNotificationService.push(pushNotification);
  }
}
