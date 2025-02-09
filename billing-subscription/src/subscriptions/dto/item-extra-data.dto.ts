import { IsString, IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ItemExtraDataDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  @ValidateIf((o: ItemExtraDataDto): boolean => !!o.subscriptionId)
  public subscriptionPlan?: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public subscriptionId?: string;
}
