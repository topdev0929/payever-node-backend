import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CookieDataDto {  
    @ApiProperty()
    @IsString()
    public affiliateProgramId: string; 
    
    @ApiProperty()
    @IsString()
    public affiliateId: string;
}
