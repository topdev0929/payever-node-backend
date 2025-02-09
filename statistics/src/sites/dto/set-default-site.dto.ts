import { IsNotEmpty, IsString } from 'class-validator';

export class SetDefaultSiteDto {
  @IsString()
  @IsNotEmpty()
  public businessId: string;

  @IsString()
  @IsNotEmpty()
  public siteId: string;
}
