import {
  Controller,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Delete,  
  UseGuards,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  JwtAuthGuard,
  Roles,
  RolesEnum,
  ParamModel,
} from '@pe/nest-kit';
import * as uuid from 'uuid';

import { AppointmentQueryDto } from '../dto';
import { AppointmentService } from '../services';
import { Appointment, AppointmentDocument, AppointmentSchemaName } from '../schemas';
import { AdminAppointmentDto } from '../dto/create-appointment/admin-appointment.dto';
import { BusinessService } from '@pe/business-kit';
import { ElasticExtraData } from '../interfaces';

@Controller('admin/appointments')
@ApiTags('admin appointments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Roles(RolesEnum.admin)
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid authorization token.' })
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
export class AdminAppointmentsController {
  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly businessService: BusinessService,
  ) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  public async getAppointments(    
    @Query() query: AppointmentQueryDto,
  ): Promise<any> {
    return this.appointmentService.getForAdmin(query);
  }

  @Get('/:appointmentId')
  @HttpCode(HttpStatus.OK)
  public async getAppointmentById(
    @ParamModel(':appointmentId', AppointmentSchemaName, true) 
    appointmentDocument: AppointmentDocument,
  ): Promise<AppointmentDocument> {
    return appointmentDocument;
  }


  @Post()
  @HttpCode(HttpStatus.OK)
  public async createAppointment(
    @Body() createAppointmentDto: AdminAppointmentDto,    
  ): Promise<Appointment> {
    const businessId: string = createAppointmentDto.businessId;
    const business: any = await this.businessService.findOneById(businessId);
    if (!business) {
      throw new NotFoundException(`business with id:'${businessId}' does not exist`);
    }

    const extraData: ElasticExtraData = {
      elasticIds: { 
        applicationScopeId: uuid.v4(),
        businessScopeId: uuid.v4(),
      },
      targetFolderId: createAppointmentDto.targetFolderId,
    };

    const appointment: AppointmentDocument = await this.appointmentService.create({
      allDay: createAppointmentDto.allDay,
      appointmentNetwork: createAppointmentDto.appointmentNetwork,
      businessId: createAppointmentDto.businessId,      
      date: createAppointmentDto.date,
      fields: createAppointmentDto.fields,
      location: createAppointmentDto.location,
      note: createAppointmentDto.note,
      products: createAppointmentDto.products,
      repeat: createAppointmentDto.repeat,
      time: createAppointmentDto.time,      
    }, extraData);

    return { 
      ...appointment.toObject(),
      applicationScopeElasticId: extraData.elasticIds.applicationScopeId, 
      businessScopeElasticId: extraData.elasticIds.businessScopeId,
    };
  }

  @Put('/:appointmentId')
  @HttpCode(HttpStatus.OK)  
  public async updateAppointment(
    @Body() appointmentDto: AdminAppointmentDto,
    @ParamModel(':appointmentId', AppointmentSchemaName, true) 
    appointmentDocument: AppointmentDocument,
  ): Promise<AppointmentDocument> {    
    return this.appointmentService.updateAppointment(appointmentDocument, appointmentDto);
  }


  @Delete('/:appointmentId')
  @HttpCode(HttpStatus.OK)
  public async deleteAppointment(    
    @ParamModel(':appointmentId', AppointmentSchemaName, true) 
    appointmentDocument: AppointmentDocument,
  ): Promise<void> {
    return this.appointmentService.delete(appointmentDocument);
  }
}

