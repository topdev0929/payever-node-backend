import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class DisplayOptionsDto {
    @ApiProperty({ required: false })
    @IsOptional()
    public title: string;

    @ApiProperty({ required: false })
    @IsOptional()
    public icon: string;

    @ApiProperty({ required: false })
    @IsOptional()
    public order: number;
}
