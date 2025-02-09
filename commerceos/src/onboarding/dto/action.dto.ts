import { IsDefined, IsString, IsNumber, IsArray, IsObject, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ActionInterface } from '../interfaces';
import { ActionIntegrationDto } from './action-integration.dto';

export class ActionDto implements ActionInterface {
  @ApiProperty({ required: false})
  public _id?: string;

  @ApiProperty({ required: true})
  @IsString()
  @IsDefined()
  public method: string;

  @ApiProperty({ required: true})
  @IsString()
  @IsDefined()
  public name: string;

  @ApiProperty({ required: true})
  @IsString()
  @IsDefined()
  public url: string;

  @ApiProperty({ required: false})
  @IsString()
  @IsOptional()
  public ifTrue?: string;

  @ApiProperty({ required: true})
  @IsNumber()
  @IsDefined()
  public orderId?: number;

  @ApiProperty({ required: true})
  @IsArray()
  @IsDefined()
  public registerSteps?: string[];

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  public payload?: any;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  public capture?: any;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  public returns?: any;

  @ApiProperty({ required: false })
  @IsOptional()
  public integration?: ActionIntegrationDto;

  @ApiProperty({ required: false})
  @IsNumber()
  @IsOptional()
  public priority?: number;

}
