import { Body, Controller, Get, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InternalBasicAuthGuard, JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';
import { environment } from '../../environments/environment';
import { EditDto } from '../dto/edit.dto';
import { RegisterAppDto } from '../dto/register-app.dto';
import { OrderAppDto } from '../dto/order-app.dto';
import { AppModel } from '../interfaces/app.model';
import { AppsService } from '../services/apps.service';

@Controller('apps')
@ApiTags('apps')
@ApiBearerAuth()
export class AppsController {
  constructor(private readonly appsService: AppsService) { }

  @Post('')
  @ApiResponse({
    description: 'The record has been successfully created.',
    status: HttpStatus.CREATED,
  })
  @ApiResponse({
    description: 'Invalid authorization token.',
    status: HttpStatus.BAD_REQUEST,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @UseGuards(new InternalBasicAuthGuard(environment.internalBasicAuthLogin, environment.internalBasicAuthPassword))
  public async create(@Body() registerAppDto: RegisterAppDto): Promise<void> {
    return this.appsService.create(registerAppDto);
  }

  @Get('')
  @ApiResponse({
    description: 'List of apps.',
    status: HttpStatus.OK,
  })
  public async getList(): Promise<AppModel[]> {
    return this.appsService.get();
  }

  @Patch(':id')
  @ApiResponse({
    description: 'Invalid authorization token.',
    status: HttpStatus.BAD_REQUEST,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @UseGuards(new InternalBasicAuthGuard(environment.internalBasicAuthLogin, environment.internalBasicAuthPassword))
  public async edit(@Param('id') id: string, @Body() dto: EditDto): Promise<AppModel> {
    return this.appsService.edit(id, dto);
  }

  @Post('app/order')
  @UseGuards(JwtAuthGuard)
  @Roles(RolesEnum.admin)
  @ApiResponse({
    description: 'Invalid authorization token.',
    status: HttpStatus.BAD_REQUEST,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({
    description: 'The ordered property has been successfully applied.',
    status: HttpStatus.CREATED,
  })
  public async setOrder(@Body() orderAppDto: OrderAppDto): Promise<void> {
    return this.appsService.setOrder(orderAppDto);
  }
}
