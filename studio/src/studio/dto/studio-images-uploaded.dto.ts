import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { SubscriptionMediaUploadedInterface, UserMediaUploadedInterface } from '../interfaces';

export class StudioImagesUploadedDto {
  @ApiProperty()
  @IsOptional()
  public businessId: string;

  @ApiProperty()
  @IsOptional()
  public medias: UserMediaUploadedInterface[] | SubscriptionMediaUploadedInterface[];

  @ApiProperty()
  @IsOptional()
  public baseUrl: string;
}
