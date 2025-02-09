import { IsNotEmpty, IsString } from 'class-validator';

export class ChannelSetExportedDto {
  @IsNotEmpty()
  @IsString()
  public id: string;

  @IsNotEmpty()
  @IsString()
  public name: string;

  @IsNotEmpty()
  @IsString()
  public businessId: string;

  @IsNotEmpty()
  @IsString()
  public type: string;
}
