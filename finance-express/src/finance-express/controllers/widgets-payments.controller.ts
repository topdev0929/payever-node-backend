import { BadRequestException, Body, Controller, Post, UseGuards, Param, NotFoundException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AbstractController } from '@pe/nest-kit';
import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';
import { CalculateRatesDto } from '../dto';
import { WidgetsPaymentService, WidgetsService } from '../services';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { WidgetModel } from '../interfaces';

@Controller('business/:businessId')
@UseGuards(JwtAuthGuard)
@ApiTags('finance-express')
@Roles(RolesEnum.merchant)
export class WidgetsPaymentController extends AbstractController {
  constructor(
    private readonly widgetsPaymentService: WidgetsPaymentService,
    private readonly widgetsService: WidgetsService,
  ) {
    super();
  }

  @Post('rates')
  public async rates(
    @Param('businessId') businessId: string,
    @Body() body: any,
  ): Promise<any> {
    const calculateRatesDto: CalculateRatesDto = plainToClass<CalculateRatesDto, any>(
      CalculateRatesDto,
      body,
    );
    const validationErrors: ValidationError[] =
      await validate(calculateRatesDto);
    if (validationErrors && validationErrors.length) {
      throw new BadRequestException(validationErrors);
    }

    const widget: WidgetModel = await this.widgetsService.getWidgetsById(calculateRatesDto.widgetId);
    if (!widget) {
      throw new NotFoundException(`Widget with id "${calculateRatesDto.widgetId}" not found`);
    }

    return this.widgetsPaymentService.requestRates(businessId, calculateRatesDto, widget);
  }

  /**
   * @deprecated left for backward compatibility
   */
  @Post('calculate-rates')
  public async calculateRates(
    @Param('businessId') businessId: string,
    @Body() body: any,
  ): Promise<any> {
    const calculateRatesDto: CalculateRatesDto = plainToClass<CalculateRatesDto, any>(
      CalculateRatesDto,
      body,
    );
    const validationErrors: ValidationError[] =
      await validate(calculateRatesDto);
    if (validationErrors && validationErrors.length) {
      throw new BadRequestException(validationErrors);
    }

    return this.widgetsPaymentService.requestRates(businessId, calculateRatesDto);
  }

}
