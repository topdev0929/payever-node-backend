import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import * as uuid from 'uuid';

import { BuilderIntegrationDto } from '../dto';
import { AppointmentService, FieldService } from '../services';
import { Appointment, AppointmentDocument, FieldDocument } from '../schemas';
import { ElasticExtraData } from '../interfaces';

@Controller('appointment/builder')
@ApiTags('appointment-for-builder')
export class BuilderAppointmentController {
  constructor(
      private readonly appointmentService: AppointmentService,
      private readonly fieldService: FieldService,
  ) { }

  @Post()
  @HttpCode(HttpStatus.OK)
  public async createAppointment(
    @Body() dto: BuilderIntegrationDto,
  ): Promise<Appointment> {
    const extraData: ElasticExtraData = {
      elasticIds: {
        applicationScopeId: uuid.v4(),
        businessScopeId: uuid.v4(),
      },
      targetFolderId: dto.contextId,
    };

    const appointment: AppointmentDocument = await this.appointmentService.createForBuilder(dto, extraData);

    return {
      ...appointment.toObject(),
      applicationScopeElasticId: extraData.elasticIds.applicationScopeId,
      businessScopeElasticId: extraData.elasticIds.businessScopeId,
    };
  }

  @Get('business/:businessId/integration')
  @HttpCode(HttpStatus.OK)
  public async getIntegration(
      @Param('businessId') businessId: string,
  ): Promise<FieldDocument[]> {
    return this.fieldService.findForBusiness(businessId);
  }
}
