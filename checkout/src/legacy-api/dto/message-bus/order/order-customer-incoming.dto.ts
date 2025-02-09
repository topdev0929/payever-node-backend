import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';

@Exclude()
export class OrderCustomerIncomingDto {
  @ApiProperty()
  @IsString()
  @Expose()
  public email: string;

  @ApiProperty()
  @IsString()
  @Expose()
  public phone?: string;

  @ApiProperty()
  @IsDate()
  @Expose()
  public birthdate?: Date;
}
