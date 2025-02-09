import {
  Controller,
  UseGuards,
  Post,
  HttpCode,
  HttpStatus,
  Body,
  Get,
  NotFoundException,
  Patch,
  Delete,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard, Roles, RolesEnum, ParamModel } from '@pe/nest-kit';
import { BusinessModel, BusinessSchemaName } from '@pe/business-kit';
import { BUSINESS_ID_PLACEHOLDER } from '../constants';
import { FraudListsService } from '../services';
import { FraudListDto, FraudListRequestDto, ItemsQueryRequestDto } from '../dto';
import { FraudListSchemaName } from '../schemas';
import { FraudListModel } from '../models';
import { plainToClass } from 'class-transformer';
import { ValidationError, validate } from 'class-validator';

@Controller('business/:businessId/fraud/lists')
@ApiTags('fraud-lists')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
export class FraudListsController {
  constructor(
    private readonly fraudListService: FraudListsService,
  ) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: FraudListRequestDto})
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: FraudListDto,
  })
  public async createFraudList(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @Body() data: any,
  ): Promise<FraudListDto> {
    const fraudListRequest: FraudListRequestDto = plainToClass(FraudListRequestDto, data);

    const errors: ValidationError[] = await validate(fraudListRequest);
    if (errors.length) {
      throw new BadRequestException(errors);
    }

    return this.fraudListService.createFraudList(fraudListRequest, business._id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  public async getFraudLists(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @Query() queryDto: ItemsQueryRequestDto,
  ): Promise<any> {
    return this.fraudListService.getFraudListsPaginated(business._id, queryDto);
  }

  @Get(':fraudListId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: FraudListDto,
  })
  public async getFraudList(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @ParamModel('fraudListId', FraudListSchemaName) fraudListModel: FraudListModel,
  ): Promise<FraudListDto> {
    if (business._id !== fraudListModel.businessId) {
      throw new NotFoundException(
        `Fraud List with id ${fraudListModel._id} doesn't belong to business ${business._id}`,
      );
    }

    return fraudListModel;
  }

  @Patch(':fraudListId')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiBody({ type: FraudListRequestDto})
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    type: FraudListDto,
  })
  public async updateFraudList(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @ParamModel('fraudListId', FraudListSchemaName) fraudListModel: FraudListModel,
    @Body() data: any,
  ): Promise<FraudListDto> {
    if (business._id !== fraudListModel.businessId) {
      throw new NotFoundException(
        `Fraud List with id ${fraudListModel._id} doesn't belong to business ${business._id}`,
      );
    }

    const fraudListRequest: FraudListRequestDto = plainToClass(FraudListRequestDto, data);

    const errors: ValidationError[] = await validate(fraudListRequest);
    if (errors.length) {
      throw new BadRequestException(errors);
    }

    return this.fraudListService.updateFraudList(fraudListModel._id, fraudListRequest, business._id);
  }

  @Delete(':fraudListId')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
  })
  public async deleteFraudList(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @ParamModel('fraudListId', FraudListSchemaName) fraudListModel: FraudListModel,
  ): Promise<void> {
    if (business._id !== fraudListModel.businessId) {
      throw new NotFoundException(
        `Fraud List with id ${fraudListModel._id} doesn't belong to business ${business._id}`,
      );
    }

    await this.fraudListService.deleteFraudListById(fraudListModel._id);
  }
}
