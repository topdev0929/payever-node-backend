import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TargetUrlDto {  
    @ApiProperty()
    @IsString()
    public affiliateProgramId: string; 
    
    @ApiProperty()
    @IsString()
    public affiliateId: string;
}
