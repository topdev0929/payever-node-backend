import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class AttributeDto {
  @ApiProperty({
    description: `Attribute Icon Url`,
  })
  @IsUrl()
  public icon: string;

  @ApiProperty({
    description: `Attribute Name`,
  })
  @IsString()
  @IsNotEmpty()
  public name: string;

  @ApiProperty({
    description: `Attribute Type`,
  })
  @IsString()
  @IsNotEmpty()
  public type: string;
}
