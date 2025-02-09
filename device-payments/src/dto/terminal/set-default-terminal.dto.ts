import { IsString, IsNotEmpty } from 'class-validator';

export class SetDefaultTerminalDto {
  @IsString()
  @IsNotEmpty()
  public businessId: string;

  @IsString()
  @IsNotEmpty()
  public terminalId: string;
}
