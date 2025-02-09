import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AddIntegrationVersionDto {

  @ApiProperty()
  @IsNotEmpty()
  public version: string;

  @ApiProperty()
  @IsNotEmpty()
  public description: string;

  @ApiProperty()
  @IsNotEmpty()
  public versionDate: string;

  @ApiProperty()
  public _id: string;
}
