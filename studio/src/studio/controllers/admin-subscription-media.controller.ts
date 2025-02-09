import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';
import { ParamModel } from '@pe/nest-kit/modules/nest-decorator/param-model';
import { AttributeFilterDto, PaginationDto, SearchMediaDto, SubscriptionMediaDto } from '../dto';
import { EventEnum } from '../enums';
import { SubscriptionMediaModel } from '../models';
import { SubscriptionMediaSchemaName } from '../schemas';
import { AttributeService, SubscriptionMediaService } from '../services';
import { EventDispatcher } from '@pe/nest-kit';

@Controller('subscription')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
@ApiTags('Admin Subscription API')
export class AdminSubscriptionMediaController {
  constructor(
    private readonly attributeService: AttributeService,
    private readonly subscriptionMediaService: SubscriptionMediaService,
    private readonly eventDispatcher: EventDispatcher,
  ) { }

  @Get()
  public async findSubscriptionMedia(
    @Query() pagination: PaginationDto,
  ): Promise<SubscriptionMediaModel[]> {
    return this.subscriptionMediaService.findSubscriptionMedia(pagination);
  }

  @Get('/compress')
  @Roles(RolesEnum.admin)
  public async compress(
    @Query('path') path: string,
  ): Promise<any> {
    return this.eventDispatcher.dispatch(EventEnum.SUBSCRIPTION_MEDIA_COMPRESS_TRIGGER);
  }

  @Get('/folder/:folderId')
  public async findSubscriptionMediaByFolder(
    @Query() pagination: PaginationDto,
    @Param('folderId') folderId: string,
  ): Promise<SubscriptionMediaModel[]> {
    return this.subscriptionMediaService.findSubscriptionMedia(pagination);
  }

  @Get('/search')
  public async search(
    @Query() search: SearchMediaDto,
  ): Promise<SubscriptionMediaModel[]> {

    return this.subscriptionMediaService.searchMedia(search);
  }

  @Get('/:subscriptionMediaId')
  public async findById(
    @ParamModel(':subscriptionMediaId', SubscriptionMediaSchemaName) data: SubscriptionMediaModel,
  ): Promise<SubscriptionMediaModel> {

    return data
      .populate({
        path: 'attributes.attribute',
        select: 'icon name type',
      }).execPopulate();
  }

  @Get('/type/:subscriptionType')
  public async findBySubscriptionType(
    @Query() pagination: PaginationDto,
    @Param('subscriptionType') subscriptionType: string,
  ): Promise<SubscriptionMediaModel[]> {
    return this.subscriptionMediaService.findBySubscriptionType(pagination, subscriptionType);
  }

  @Post()
  public async save(
    @Body() body: SubscriptionMediaDto,
  ): Promise<SubscriptionMediaModel | Error> {
    return this.subscriptionMediaService.findByUrlAndUpdateOrInsert(body);
  }

  @Get('/by-attribute/:attributeId/:attributeValue')
  public async findByAttribute(
    @Query() pagination: PaginationDto,
    @Param('attributeId') attributeId: string,
    @Param('attributeValue') attributeValue: string,
  ): Promise<SubscriptionMediaModel[]> {

    return this.subscriptionMediaService.findByAttribute(pagination, attributeId, attributeValue);
  }

  @Post('/by-attribute')
  public async findByMultipleAttributes(
    @Query() pagination: PaginationDto,
    @Body() attributeFilter: AttributeFilterDto,
  ): Promise<SubscriptionMediaModel[]> {

    return this.subscriptionMediaService.findByMultipleAttributes(pagination, attributeFilter);
  }


  @Delete('/:subscriptionMediaId')
  public async deleteById(
    @ParamModel(':subscriptionMediaId', SubscriptionMediaSchemaName) data: SubscriptionMediaModel,
  ): Promise<void> {
    await this.subscriptionMediaService.remove(data);
  }
}
