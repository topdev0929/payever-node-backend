import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length, ValidateIf } from 'class-validator';

export class CreatePaymentAddressDto {
  @ApiProperty()
  @IsString({ groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  public salutation: string;

  @ApiProperty()
  @IsString({ groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'link']})
  @IsNotEmpty({ groups: ['submit']})
  public first_name: string;

  @ApiProperty()
  @IsString({ groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'link']})
  @IsNotEmpty({ groups: ['submit']})
  public last_name: string;

  @ApiProperty()
  @IsString({ groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'link']})
  @IsNotEmpty({ groups: ['submit']})
  public street: string;

  @ApiProperty()
  @IsString({ groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  @ValidateIf((o: CreatePaymentAddressDto) => !!o.street_number, { groups: ['create', 'submit', 'link']})
  @Length(0, 10, { groups: ['create', 'submit', 'link']})
  public street_number: string;

  @ApiProperty()
  @IsString({ groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'link']})
  @IsNotEmpty({ groups: ['submit']})
  public zip: string;

  @ApiProperty()
  @IsString({ groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'link']})
  @IsNotEmpty({ groups: ['submit']})
  @ValidateIf((o: CreatePaymentAddressDto) => o.country !== '', { groups: ['create']})
  @Length(2, 2, { groups: ['create', 'submit', 'link']})
  public country: string;

  @ApiProperty()
  @IsString({ groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  public region: string;

  @ApiProperty()
  @IsString({ groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'link']})
  @IsNotEmpty({ groups: ['submit']})
  public city: string;

  @ApiProperty()
  @IsString({ groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  public address_line_2: string;
}
