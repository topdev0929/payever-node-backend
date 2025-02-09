import { IsString, IsOptional, IsNumber, IsDate } from 'class-validator';

export class ApiCallEventDto {
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
  public paymentMethod: string;

  @IsString()
  @IsOptional()
  public channel: string;

  @IsString()
  @IsOptional()
  public channelSetId: string;

  @IsNumber()
  @IsOptional()
  public amount: number;

  @IsString()
  @IsOptional()
  public currency: string;

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
