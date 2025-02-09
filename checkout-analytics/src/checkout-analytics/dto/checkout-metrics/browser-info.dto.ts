import { Exclude, Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { DeviceEnum, BrowserEnum } from '../../enums';

@Exclude()
export class BrowserInfoDto {
  @IsOptional()
  @Expose()
  public device: DeviceEnum;

  @Expose()
  @IsOptional()
  public browser: BrowserEnum;
}
