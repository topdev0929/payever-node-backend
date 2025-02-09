import { IsNotEmpty, IsString } from 'class-validator';

export class SetDefaultTerminalDto {
  @IsString()
  @IsNotEmpty()
  public businessId: string;

  @IsString()
  @IsNotEmpty()
  public terminalId: string;
}
