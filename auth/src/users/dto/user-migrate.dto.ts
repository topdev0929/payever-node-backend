import { ApiProperty } from '@nestjs/swagger';

export class UserMigrateDto {
  @ApiProperty()
  public _id: string;

  @ApiProperty()
  public email: string;

  @ApiProperty()
  public password: string;

  @ApiProperty()
  public salt: string;

  @ApiProperty()
  public isVerified: boolean;

  @ApiProperty()
  public firstName: string;

  @ApiProperty()
  public lastName: string;
}
