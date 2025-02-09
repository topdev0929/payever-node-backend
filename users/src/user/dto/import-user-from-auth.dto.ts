import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class ImportUserFromAuthDto {
  @ApiProperty()
  public _id: string;

  @ApiProperty()
  @Transform((email: string) => email?.toLowerCase())
  public email: string;

  @ApiProperty()
  public firstName: string;

  @ApiProperty()
  public lastName: string;
}
