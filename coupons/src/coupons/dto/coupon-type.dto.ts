import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsEnum,
} from 'class-validator';
import {
    CouponTypeEnum ,
} from '../enum';
import { CouponType } from '../schemas';

export abstract class CouponTypeDto implements CouponType {
    @ApiProperty({
        enum: CouponTypeEnum,
    })
    @IsNotEmpty()
    @IsEnum(CouponTypeEnum)
    public type: CouponTypeEnum;
}
