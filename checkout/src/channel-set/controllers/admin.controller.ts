import { Body, Controller, Delete, Get, Param, Patch, Post, NotFoundException, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { BusinessService } from '@pe/business-kit';
import { BusinessModel } from '../../business';
import { ChannelSetSchemaName } from '../../mongoose-schema';
import { CreateChannelSetDto, UpdateChannelSetDto, AdminChannelSetListDto } from '../dto';
import { ChannelSetModel } from '../models';
import { ChannelSetService } from '../services';

@Controller('admin/channel-sets')
@ApiBearerAuth()
@ApiTags('admin')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
export class AdminChannelSetController {
  constructor(
    private readonly businessService: BusinessService,
    private readonly channelSetService: ChannelSetService,
  ) { }

  @Get()
  public async getAll(
    @Query() dto: AdminChannelSetListDto,
  ): Promise<any> {
    return this.channelSetService.retrieveListForAdmin(dto);
  }

  @Post()
  public async create(
    @Body() dto: CreateChannelSetDto,
  ): Promise<ChannelSetModel> {
    const business: BusinessModel = await this.businessService.findOneById(dto.business) as BusinessModel;
    if (!business) {
      throw new NotFoundException(`Business with id ${dto.business} not found`);
    }

    return this.channelSetService.createOrUpdate(business, dto.id, dto);
  }

  @Patch(':channelSetId')
  public async update(
    @ParamModel(':channelSetId', ChannelSetSchemaName, true) channelSet: ChannelSetModel,
    @Param('channelSetId') swagger__channelSetId: string,
    @Body() dto: UpdateChannelSetDto,
  ): Promise<void> {
    await this.channelSetService.updateById(channelSet._id, dto);
  }

  @Delete(':channelSetId')
  public async remove(
    @ParamModel(':channelSetId', ChannelSetSchemaName, true) channelSet: ChannelSetModel,
    @Param('channelSetId') swagger__channelSetId: string,
  ): Promise<void> {
    await this.channelSetService.deleteOneById(channelSet._id);
  }
}
