import { ApiProperty } from '@nestjs/swagger';
import {
    IsBoolean,
    IsInt,
    Min,
    ValidateIf,
} from 'class-validator';

export class CouponLimitDto {
    @ApiProperty()
    @IsBoolean()
    public limitOneUsePerCustomer: boolean;

    @ApiProperty()
    @IsBoolean()
    public limitUsage: boolean;

    @ApiProperty()
    @IsInt()
    @Min(1)
    @ValidateIf((self: CouponLimitDto) => self.limitUsage)
    public limitUsageAmount: number;

    // @ApiProperty()
    // @IsString()
    // @IsOptiona()
    // public channel: string;
}
