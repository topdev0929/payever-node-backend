import { IsString, IsOptional, IsDate } from 'class-validator';

export class ActionApiCallEventDto {
  @IsString()
  @IsOptional()
  public id: string;

  @IsString()
  @IsOptional()
  public businessId: string;

  @IsString()
  @IsOptional()
  public paymentId: string;

  @IsString()
  @IsOptional()
  public action: string;

  @IsString()
  @IsOptional()
  public status: string;

  @IsString()
  @IsOptional()
  public error: string;

  @IsString()
  @IsOptional()
  public executionTime: string;

  @IsDate()
  @IsOptional()
  public createdAt: Date;

  @IsDate()
  @IsOptional()
  public updatedAt: Date;
}
