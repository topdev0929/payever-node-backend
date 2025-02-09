import { Allow, IsString, IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AddressDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public country: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public city: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public zip_code: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public street: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public salutation: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public first_name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public last_name: string;

  @Allow()
  @Expose()
  public getFullAddress(): string {
    return [
      this.street,
      [[this.country, this.zip_code].filter((el: string): boolean => !!el).join('-'), this.city]
        .filter((el: string): boolean => !!el)
        .join(' '),
    ]
      .filter((el: string): boolean => !!el)
      .join(', ');
  }
}
