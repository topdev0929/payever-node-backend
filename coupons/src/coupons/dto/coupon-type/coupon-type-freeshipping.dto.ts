import { ApiProperty } from '@nestjs/swagger';
import {
    IsEnum,
    IsBoolean,
    IsNumber,
    IsInt,
    Min,
    IsISO31661Alpha2,
    IsPositive,
    ValidateIf,
    IsNotEmpty,
} from 'class-validator';

import { CouponTypeFreeShippingTypeEnum, CouponTypeMinimumRequirementsEnum } from '../../enum';
import { CouponTypeDto } from '../coupon-type.dto';

export class CouponTypeFreeShippingDto extends CouponTypeDto {
    @ApiProperty({
        enum: CouponTypeFreeShippingTypeEnum,
    })
    @IsEnum(CouponTypeFreeShippingTypeEnum)
    public freeShippingType: CouponTypeFreeShippingTypeEnum;

    @ApiProperty()
    @ValidateIf(
        (self: CouponTypeFreeShippingDto) =>
            self.freeShippingType === CouponTypeFreeShippingTypeEnum.SELECTED_COUNTRIES,
    )
    @IsNotEmpty()
    @IsISO31661Alpha2({ each: true })
    public freeShippingToCountries: string[];

    @ApiProperty()
    @IsBoolean()
    public excludeShippingRatesOverCertainAmount: boolean;

    @ApiProperty()
    @IsNumber()
    @IsPositive()
    @ValidateIf(
        (self: CouponTypeFreeShippingDto) =>
            self.excludeShippingRatesOverCertainAmount,
    )
    public excludeShippingRatesOverCertainAmountValue: number;

    @ApiProperty({
        enum: CouponTypeMinimumRequirementsEnum,
    })
    @IsEnum(CouponTypeMinimumRequirementsEnum)
    public minimumRequirements: CouponTypeMinimumRequirementsEnum;

    @ApiProperty()
    @IsPositive()
    @IsNumber()
    @ValidateIf(
        (self: CouponTypeFreeShippingDto) =>
            self.minimumRequirements === CouponTypeMinimumRequirementsEnum.MINIMUM_PURCHASE_AMOUNT,
    )
    public minimumRequirementsPurchaseAmount: number;

    @ApiProperty()
    @IsInt()
    @Min(1)
    @ValidateIf(
        (self: CouponTypeFreeShippingDto) =>
            self.minimumRequirements === CouponTypeMinimumRequirementsEnum.MINIMUM_QUANTITY_OF_ITEMS,
    )
    public minimumRequirementsQuantityOfItems: number;
}
