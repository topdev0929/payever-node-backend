import { ApiProperty } from '@nestjs/swagger';
import {
    IsNumber,
    IsEnum,
    ValidateIf,
    IsPositive,
    Min,
    Max,
    IsString,
    IsInt,
    IsUUID,
    ValidateNested,
    IsNotEmpty,
    ArrayMinSize,
} from 'class-validator';

import { CouponTypeAppliedToEnum, CouponTypeMinimumRequirementsEnum } from '../../enum';
import { CouponTypeDto } from '../coupon-type.dto';

export class CouponTypePercentageDto extends CouponTypeDto {
    @ApiProperty()
    @IsNumber()
    @IsPositive()
    @Max(100)
    public discountValue: number;

    @ApiProperty({
        enum: CouponTypeAppliedToEnum,
    })
    @IsEnum(CouponTypeAppliedToEnum)
    public appliesTo: CouponTypeAppliedToEnum;

    @ApiProperty()
    @ValidateIf((self: CouponTypePercentageDto) => self.appliesTo === CouponTypeAppliedToEnum.SPECIFIC_CATEGORIES)
    @IsNotEmpty()
    @IsUUID('4', { each: true })
    @ArrayMinSize(1)
    public appliesToCategories: string[];

    @ApiProperty()
    @ValidateIf((self: CouponTypePercentageDto) => self.appliesTo === CouponTypeAppliedToEnum.SPECIFIC_PRODUCTS)
    @IsNotEmpty()
    @IsUUID('4', { each: true })
    @ArrayMinSize(1)
    public appliesToProducts: string[];

    @ApiProperty({
        enum: CouponTypeMinimumRequirementsEnum,
    })
    @IsEnum(CouponTypeMinimumRequirementsEnum)
    public minimumRequirements: CouponTypeMinimumRequirementsEnum;

    @ApiProperty()
    @IsPositive()
    @IsNumber()
    @ValidateIf(
        (self: CouponTypePercentageDto) =>
            self.minimumRequirements === CouponTypeMinimumRequirementsEnum.MINIMUM_PURCHASE_AMOUNT,
    )
    public minimumRequirementsPurchaseAmount: number;

    @ApiProperty()
    @IsInt()
    @Min(1)
    @ValidateIf(
        (self: CouponTypePercentageDto) =>
            self.minimumRequirements === CouponTypeMinimumRequirementsEnum.MINIMUM_QUANTITY_OF_ITEMS,
    )
    public minimumRequirementsQuantityOfItems: number;
}
