import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AttributeDto } from './attribute.dto';
import { ShowOnEnum } from '../enums';
import { ApiProperty } from '@nestjs/swagger';

export class UserAttributeDto extends AttributeDto {
  @IsString()
  @IsNotEmpty()
  public businessId: string;

  @IsOptional()
  public filterAble: boolean;

  @IsOptional()
  public onlyAdmin: boolean;

  @IsOptional()
  @ApiProperty({
    enum: Object.values(ShowOnEnum),
  })
  @IsEnum(ShowOnEnum)
  public showOn: ShowOnEnum;

  @IsOptional()
  public defaultValue: string;

  @IsOptional()
  public userAttributeGroupId: string;
}
