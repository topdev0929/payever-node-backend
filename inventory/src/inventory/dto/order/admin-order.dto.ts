import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDefined, IsOptional } from 'class-validator';
import { FlowDto } from '../api';


export class AdminOrderDto extends FlowDto{
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public businessId: string;
}
