import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import { MediaTypeEnum } from '../enums';
import { IsAlbumExist, IsUserAttributeBusiness, IsUserAttributeGroupBusiness } from '../constraints';
import { MediaAttributeInterface, UserMediaAttributeInterface } from '../interfaces';

export class UserMediaDto {
  @ApiProperty({ 
    description: `Media Url`,
  })
  @IsUrl()
  @IsOptional()
  public url: string;

  @ApiProperty({
    description: `Description`,
  })
  @IsOptional()
  public description?: string;

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
  @IsOptional()
  public name: string;

  @IsString()
  @IsNotEmpty()
  public businessId: string;

  @ApiProperty({
    description: `Album ID`,
  })
  @IsAlbumExist('businessId')
  @IsOptional()
  public albumId?: string;
  
  @IsArray()
  @IsOptional()
  public attributes?: MediaAttributeInterface[];

  @IsArray()
  @IsOptional()
  @IsUserAttributeBusiness('businessId')
  public userAttributes?: UserMediaAttributeInterface[];

  @IsArray()
  @IsOptional()
  @IsUserAttributeGroupBusiness('businessId')
  public userAttributeGroups?: string[];

  @IsOptional()
  public text?: any;
}
