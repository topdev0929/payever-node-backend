import { IsEnum, IsString } from 'class-validator';

export enum SortDirectionEnum {
  ASC = 'asc',
  DESC = 'desc',
}

export class SortDto {
  @IsEnum(SortDirectionEnum)
  public direction: SortDirectionEnum;
  @IsString()
  public field: string;
}
