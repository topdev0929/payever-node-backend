import { ApiProperty } from '@nestjs/swagger';
import { Type  } from 'class-transformer';
import { IsNotEmpty, IsString, Min } from 'class-validator';


export class AdminCreateContainerDto {
  @IsNotEmpty()
  public name: string;
}
