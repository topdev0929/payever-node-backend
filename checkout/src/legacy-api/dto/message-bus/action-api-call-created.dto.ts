import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDate } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ActionApiCallCreatedDto {
  @ApiProperty()
  @IsString()
  @Expose()
  public action: string;

  @ApiProperty()
  @IsString()
  @Expose()
  public businessId: string;

  @ApiProperty()
  @IsString()
  @Expose()
  public paymentId: string;

  @ApiProperty()
  @IsString()
  @Expose()
  public status: string;

  @ApiProperty()
  @IsString()
  @Expose()
  public error: string;

  @ApiProperty()
  @IsString()
  @Expose()
  public executionTime: string;

  @ApiProperty()
  @IsDate()
  @Expose()
  public createdAt: Date;

  @ApiProperty()
  @IsDate()
  @Expose()
  public updatedAt: Date;
}
