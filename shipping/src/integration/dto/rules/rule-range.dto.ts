import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, IsNotEmpty, IsDefined } from 'class-validator';
import { RuleRangeInterface } from '../../interfaces/rules';

export class RuleRangeDto implements RuleRangeInterface {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    @IsDefined()
    @Min(0)
    public readonly from: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    @IsDefined()
    @Min(0)
    public readonly upTo: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    @IsDefined()
    @IsNumber()
    public readonly rate: number;
}
