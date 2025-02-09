import { Body, Controller, Get, HttpCode, HttpStatus, Param, Put, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { FastifyReply } from 'fastify';
import { RecordModel } from '../models/record.model';
import { RecordSchemaName } from '../schemas/record.schema';
import { RecordService } from '../services/record.service';

@Controller('storage')
@ApiTags('record')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class StorageController {
  constructor(
    private readonly recordService: RecordService,
  ) { }

  @Put(':recordId/flow/:flowId')
  @HttpCode(HttpStatus.CREATED)
  @Roles(RolesEnum.merchant, RolesEnum.guest)
  public async create(
    @Param('recordId') recordId: string,
    @Body() data: any,
    @Res() res: FastifyReply<any>,
  ): Promise<void> {
    await this.recordService.save(recordId, data);
    res.status(HttpStatus.CREATED);
    res.send();
  }

  @Get(':recordId')
  @Roles(RolesEnum.admin)
  public async retrieve(
    @ParamModel('recordId', RecordSchemaName) record: RecordModel,
  ): Promise<{ }> {
    return record.data;
  }
}
