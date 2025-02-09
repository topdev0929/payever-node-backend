import { IsBoolean, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubscriptionNetworkDto {
  @ApiProperty()
  @IsString()
  public favicon: string;

  @ApiProperty()
  @IsString()
  public logo: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  public isDefault?: boolean;
  
  @ApiProperty()
  @IsString()
  public name: string;
}
