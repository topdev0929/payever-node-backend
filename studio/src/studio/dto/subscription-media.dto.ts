import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import { MediaTypeEnum, SubscriptionMediaTypeEnum } from '../enums';
import { MediaAttributeInterface } from '../interfaces';

export class SubscriptionMediaDto {
  @ApiProperty({ 
    description: `Media Url`,
  })
  @IsUrl()
  @IsNotEmpty()
  public url: string;

  @ApiProperty({ 
    description: `File Type`,
    enum: Object.values(MediaTypeEnum),
  })
  @IsEnum(MediaTypeEnum)
  @IsNotEmpty()
  public mediaType: MediaTypeEnum;

  @ApiProperty({
    description: `Media Name`,
  })
  @IsString()
  @IsNotEmpty()
  public name: string;

  @ApiProperty({ 
    description: `Subscription Type`,
    enum: Object.values(SubscriptionMediaTypeEnum),
  })
  @IsEnum(SubscriptionMediaTypeEnum)
  @IsOptional()
  public subscriptionType?: SubscriptionMediaTypeEnum;

  @IsArray()
  @IsOptional()
  public attributes?: MediaAttributeInterface[];
}
