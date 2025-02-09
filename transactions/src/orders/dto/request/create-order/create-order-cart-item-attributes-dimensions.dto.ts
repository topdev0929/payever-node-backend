import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class CreateOrderCartItemAttributesDimensionsDto {
  @ApiProperty()
  @IsNumber({ }, { groups: ['create', 'submit']})
  @IsOptional({ groups: ['create', 'submit']})
  public height?: number;

  @ApiProperty()
  @IsNumber({ }, { groups: ['create', 'submit']})
  @IsOptional({ groups: ['create', 'submit']})
  public width?: number;

  @ApiProperty()
  @IsNumber({ }, { groups: ['create', 'submit']})
  @IsOptional({ groups: ['create', 'submit']})
  public length?: number;
}
