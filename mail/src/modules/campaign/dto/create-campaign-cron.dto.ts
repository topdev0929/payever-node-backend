import { CreateCampaignDto } from './create-campaign.dto';
import { Type } from 'class-transformer';
import { IsString, IsDefined, IsNotEmpty, ValidateNested, IsNumber, IsDate } from 'class-validator';

export class CreateCampaignCronDto {
  @ValidateNested()
  @IsDefined()
  @Type(() => CreateCampaignDto)
  public campaign: CreateCampaignDto;

  @IsString()
  @IsNotEmpty()
  public period: string;

  @IsString()
  public date: string;

  @IsString()
  public dayOfWeek: string;

  @IsNumber()
  public day: number;

  @IsNumber()
  public hours: number;

  @IsNumber()
  public minutes: number;
}
