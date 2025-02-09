import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AffiliateBankDto {  
  @ApiProperty()
  @IsString()
  public accountHolder: string;
  
  @ApiProperty()
  @IsString()
  public accountNumber: string; 
  
  @ApiProperty()
  @IsString()
  public bankName: string; 
  
  @ApiProperty()
  @IsString()
  public city: string;
  
  @ApiProperty()
  @IsString()
  public country: string;
}
