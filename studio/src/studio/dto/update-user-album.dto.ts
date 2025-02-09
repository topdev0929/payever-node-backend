import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsAlbumExist, IsUniqueAlbumName, IsUserAttributeBusiness, IsUserAttributeGroupBusiness } from '../constraints';
import { UserMediaAttributeInterface } from '../interfaces';

export class UpdateUserAlbumDto {
  @IsString()
  @IsNotEmpty()
  public businessId: string;

  @IsString()
  @IsNotEmpty()
  public albumId: string;

  @IsString()
  @IsOptional()
  public description: string;

  @IsOptional()
  public icon: string;

  @ApiProperty({
    description: `Media Name`,
  })
  @IsOptional()
  @IsUniqueAlbumName('businessId', 'parent')
  public name: string;

  @ApiProperty({ required: false })
  @IsAlbumExist('businessId')
  @IsOptional()
  public parent: string;

  @IsArray()
  @IsOptional()
  @IsUserAttributeBusiness('businessId')
  public userAttributes?: UserMediaAttributeInterface[];

  @IsArray()
  @IsOptional()
  @IsUserAttributeGroupBusiness('businessId')
  public userAttributeGroups?: string[];

  @IsOptional()
  @IsArray()
  @Type(() => String)
  public tags: string[];
}
