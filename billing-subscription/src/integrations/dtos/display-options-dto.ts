import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class DisplayOptionsDto {
    @ApiProperty()
    @IsOptional()
    public title: string;

    @ApiProperty()
    @IsOptional()
    public icon: string;

    @ApiProperty()
    @IsOptional()
    public order: number;
}
