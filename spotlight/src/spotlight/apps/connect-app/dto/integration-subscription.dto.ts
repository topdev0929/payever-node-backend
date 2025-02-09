import { IsNotEmpty, IsString, IsBoolean, ValidateNested, IsOptional } from 'class-validator';
import { IntegrationDto } from './integration.dto';
import { Type } from 'class-transformer';

export class IntegrationSubscriptionDto {

  @IsString()
  public id: string;

  @IsString()
  @IsNotEmpty()
  public businessId: string;

  @IsBoolean()
  @IsOptional()
  public installed: boolean;

  @Type(() => IntegrationDto)
  @ValidateNested()
  public integration: IntegrationDto;
}
