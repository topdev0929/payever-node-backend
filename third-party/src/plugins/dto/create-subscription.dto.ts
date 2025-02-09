import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateSubscriptionDto {
  @ApiProperty()
  @IsString()
  public externalId: string;

  @ApiProperty()
  public actions: [{ name: string; url: string; method?: string }];
}
