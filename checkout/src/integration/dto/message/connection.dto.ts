import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ConnectionOptionsDto } from './connection-options.dto';

export class ConnectionDto {
  @IsNotEmpty()
  @IsString()
  public id: string;

  @IsNotEmpty()
  @IsString()
  public name: string;

  @IsOptional()
  @Type(() => ConnectionOptionsDto)
  public options: ConnectionOptionsDto;
}
