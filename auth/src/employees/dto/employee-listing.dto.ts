import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, Allow } from 'class-validator';

import { EmployeeFilterDto, EmployeeOrderDto } from './employees';
import { EmployeeSearchInterface } from '../interfaces/employee-search.interface';
import { EmployeeOrderInterface } from '../interfaces/employee-order.interface';
import { GroupFilterDto } from './groups';
import { EmployeeFilterInterface } from '../interfaces/employee-filter.interface';

export class EmployeeListingDto {
  @ApiProperty()
  @IsNotEmpty()
  @Transform((value: string) => Number(value))
  public limit: string | number;

  @ApiProperty()
  @IsNotEmpty()
  @Transform((value: string) => Number(value))
  public page: string | number;

  @ApiProperty()
  @Allow()
  @Transform((value: EmployeeFilterDto) => EmployeeListingDto.transformValuesToRegex(value))
  public filter: EmployeeFilterDto | EmployeeFilterInterface;

  @ApiProperty()
  @Allow()
  @Transform((search: string) => ({ $regex: `^.*${search}.*$`, $options: 'i' }))
  public search: string | EmployeeSearchInterface;

  @ApiProperty()
  @Allow()
  @Transform((value: EmployeeOrderDto) => EmployeeListingDto.transformDtoToAggregateOrder(value))
  public order: EmployeeOrderDto | EmployeeOrderInterface = { updatedAt: 1 };

  private static transformDtoToAggregateOrder: (orderDto: EmployeeOrderDto) => EmployeeOrderInterface = (
    orderDto: EmployeeOrderDto,
  ): EmployeeOrderInterface => {
    const parsedOrder: { } = { };
    for (const key in orderDto) {
      if (orderDto.hasOwnProperty(key)) {
        parsedOrder[key] = parseInt(orderDto[key], 10);
      }
    }

    return parsedOrder;
  };

  private static transformValuesToRegex: (object: EmployeeFilterDto | GroupFilterDto) => EmployeeFilterInterface = (
    object: any,
  ): EmployeeFilterInterface => {
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        object[key] = { $regex: new RegExp(object[key], 'i') };
      }
    }

    return object;
  };
}
