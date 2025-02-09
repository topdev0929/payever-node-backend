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
import { FraudRuleSchemaName } from '../schemas';
import { FraudRuleDto, FraudRuleRequestDto, ItemsQueryRequestDto } from '../dto';
import { FraudRuleModel } from '../models';
import { FraudRulesService } from '../services';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

@Controller('business/:businessId/fraud/rules')
@ApiTags('fraud-rules')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
export class FraudRulesController {
  constructor(
    private readonly fraudRuleService: FraudRulesService,
  ) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: FraudRuleRequestDto})
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: FraudRuleDto,
  })
  public async createFraudRule(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @Body() data: any,
  ): Promise<FraudRuleModel> {
    const fraudRuleRequest: FraudRuleRequestDto = plainToClass(FraudRuleRequestDto, data);

    const errors: ValidationError[] = await validate(fraudRuleRequest);
    if (errors.length) {
      throw new BadRequestException(errors);
    }

    return this.fraudRuleService.createFraudRule(fraudRuleRequest, business._id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  public async getFraudRules(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @Query() queryDto: ItemsQueryRequestDto,
  ): Promise<any> {

    return this.fraudRuleService.getFraudRulesPaginated(business._id, queryDto);
  }

  @Get(':fraudRuleId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: FraudRuleDto,
  })
  public async getFraudRule(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @ParamModel('fraudRuleId', FraudRuleSchemaName) fraudRuleModel: FraudRuleModel,
  ): Promise<FraudRuleModel> {
    if (business._id !== fraudRuleModel.businessId) {
      throw new NotFoundException(
        `Fraud Rule with id ${fraudRuleModel._id} doesn't belong to business ${business._id}`,
      );
    }

    return fraudRuleModel;
  }

  @Patch(':fraudRuleId')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiBody({ type: FraudRuleRequestDto})
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    type: FraudRuleDto,
  })
  public async updateFraudRule(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @ParamModel('fraudRuleId', FraudRuleSchemaName) fraudRuleModel: FraudRuleModel,
    @Body() data: any,
  ): Promise<FraudRuleModel> {
    if (business._id !== fraudRuleModel.businessId) {
      throw new NotFoundException(
        `Fraud Rule with id ${fraudRuleModel._id} doesn't belong to business ${business._id}`,
      );
    }

    const fraudRuleRequest: FraudRuleRequestDto = plainToClass(FraudRuleRequestDto, data);

    const errors: ValidationError[] = await validate(fraudRuleRequest);
    if (errors.length) {
      throw new BadRequestException(errors);
    }

    return this.fraudRuleService.updateFraudRule(fraudRuleModel._id, fraudRuleRequest, business._id);
  }

  @Delete(':fraudRuleId')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
  })
  public async deleteFraudRule(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @ParamModel('fraudRuleId', FraudRuleSchemaName) fraudRuleModel: FraudRuleModel,
  ): Promise<void> {
    if (business._id !== fraudRuleModel.businessId) {
      throw new NotFoundException(
        `Fraud Rule with id ${fraudRuleModel._id} doesn't belong to business ${business._id}`,
      );
    }

    await this.fraudRuleService.deleteFraudRuleById(fraudRuleModel._id);
  }
}
