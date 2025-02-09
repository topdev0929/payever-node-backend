import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CampaignCreateDto {
  @IsString()
  @IsNotEmpty()
  public id: string;

  @IsString()
  @IsOptional()
  public _id: string;

  @IsNotEmpty()
  @IsString()
  public channelSet: string;

  @IsNotEmpty()
  @IsString()
  public business: string;

  @IsNotEmpty()
  @IsString()
  public name: string;

  @IsNotEmpty()
  @IsNumber()
  public contactsCount: number;
}
