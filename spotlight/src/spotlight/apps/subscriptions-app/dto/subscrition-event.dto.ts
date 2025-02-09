import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class SubscriptionsEventDto {
  @IsString()
  @IsNotEmpty()
  public id: string;

  @IsOptional()
  public business: {
    id: string;
  };

  @IsString()
  @IsOptional()
  public name: string;

  @IsString()
  @IsOptional()
  public planType: string;
}
