import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, Allow } from 'class-validator';
import { PopulateOptions } from 'mongoose';

import { GroupFilterDto } from './groups';
import { EmployeeFilterDto, EmployeeOrderDto } from './employees';
import { EmployeeSearchInterface } from '../interfaces/employee-search.interface';
import { EmployeeOrderInterface } from '../interfaces/employee-order.interface';
import { EmployeeFilterInterface } from '../interfaces/employee-filter.interface';

export class GroupListingDto {
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
  @Transform((value: EmployeeFilterDto) => GroupListingDto.transformValuesToRegex(value))
  public filter: EmployeeFilterDto | EmployeeFilterInterface;

  @ApiProperty()
  @Allow()
  @Transform((search: string) => ({ $regex: `^.*${search}.*$`, $options: 'i' }))
  public search: string | EmployeeSearchInterface;

  @ApiProperty()
  @Allow()
  @Transform((value: EmployeeOrderDto) => GroupListingDto.transformDtoToAggregateOrder(value))
  public order: any = { updatedAt: 1 };

  @ApiProperty()
  @Allow()
  @Transform((value: EmployeeOrderDto) => GroupListingDto.transformQueryIntoPopulate(value))
  public populate: any;

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

  private static transformQueryIntoPopulate: (populate: any) => PopulateOptions[] = (
    populate: any,
  ): PopulateOptions[] => {
    if (!populate) {
      return [];
    }
    const populateQuery: PopulateOptions[] = [];
    Object.keys(populate).forEach((key: string) => {
      const fields: string[] = [];
      Object.keys(populate[key]).forEach((field: string) => {
        fields.push(field);
      });
      populateQuery.push({ path: key, select: fields });
    });

    return populateQuery;
  };
}
