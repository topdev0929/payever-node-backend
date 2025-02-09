import { ApiProperty } from '@nestjs/swagger';
import {
    IsEnum,
    IsInt,
    Max,
    Min,
    IsBoolean,
    IsString,
    IsUUID,
    ValidateIf,
    IsNotEmpty,
    ArrayMinSize,
    IsNumber,
} from 'class-validator';

import {
    CouponTypeBuyXGetYBuyRequirementsTypeEnum,
    CouponTypeBuyXGetYGetDiscountTypesEnum,
    CouponTypeBuyOrGetXGetYItemTypeEnum,
} from '../../enum';
import { CouponTypeDto } from '../coupon-type.dto';

export class CouponTypeBuyXGetYDto extends CouponTypeDto {
    // BUY
    @ApiProperty({
        enum: CouponTypeBuyXGetYBuyRequirementsTypeEnum,
    })
    @IsEnum(CouponTypeBuyXGetYBuyRequirementsTypeEnum)
    public buyRequirementType: CouponTypeBuyXGetYBuyRequirementsTypeEnum;

    @ApiProperty()
    @ValidateIf(
        (self: CouponTypeBuyXGetYDto) =>
            self.buyRequirementType === CouponTypeBuyXGetYBuyRequirementsTypeEnum.MINIMUM_QUANTITY_OF_ITEMS,
    )
    @IsInt()
    @Min(1)
    public buyQuantity: number;

    @ApiProperty()
    @ValidateIf(
        (self: CouponTypeBuyXGetYDto) =>
            self.buyRequirementType === CouponTypeBuyXGetYBuyRequirementsTypeEnum.MINIMUM_PURCHASE_AMOUNT,
    )
    @IsNumber()
    @Min(1)
    public buyAmount: number;

    @ApiProperty({
        enum: CouponTypeBuyOrGetXGetYItemTypeEnum,
    })
    @IsEnum(CouponTypeBuyOrGetXGetYItemTypeEnum)
    public buyType: CouponTypeBuyOrGetXGetYItemTypeEnum;

    @ApiProperty()
    @ValidateIf(
        (self: CouponTypeBuyXGetYDto) =>
            self.buyType === CouponTypeBuyOrGetXGetYItemTypeEnum.SPECIFIC_PRODUCTS,
    )
    @IsNotEmpty()
    @ArrayMinSize(1)
    @IsUUID('4', { each: true })
    public buyProducts: string[];

    @ApiProperty()
    @ValidateIf(
        (self: CouponTypeBuyXGetYDto) =>
            self.buyType === CouponTypeBuyOrGetXGetYItemTypeEnum.SPECIFIC_CATEGORIES,
    )
    @IsNotEmpty()
    @IsUUID('4', { each: true })
    @ArrayMinSize(1)
    public buyCategories: string[];


    // GET
    @ApiProperty({
        enum: CouponTypeBuyOrGetXGetYItemTypeEnum,
    })
    @IsEnum(CouponTypeBuyOrGetXGetYItemTypeEnum)
    public getType: CouponTypeBuyOrGetXGetYItemTypeEnum;

    @ApiProperty()
    @IsInt()
    @Min(1)
    public getQuantity: number;

    @ApiProperty()
    @ValidateIf(
        (self: CouponTypeBuyXGetYDto) =>
            self.getType === CouponTypeBuyOrGetXGetYItemTypeEnum.SPECIFIC_CATEGORIES,
    )
    @IsNotEmpty()
    @IsUUID('4', { each: true })
    @ArrayMinSize(1)
    public getCategories: string[];

    @ApiProperty()
    @ValidateIf(
        (self: CouponTypeBuyXGetYDto) =>
            self.getType === CouponTypeBuyOrGetXGetYItemTypeEnum.SPECIFIC_PRODUCTS,
    )
    @IsNotEmpty()
    @IsUUID('4', { each: true })
    @ArrayMinSize(1)
    public getProducts: string[];

    // DISCOUNT
    @ApiProperty({
        enum: CouponTypeBuyXGetYGetDiscountTypesEnum,
    })
    @IsEnum(CouponTypeBuyXGetYGetDiscountTypesEnum)
    public getDiscountType: CouponTypeBuyXGetYGetDiscountTypesEnum;

    @ApiProperty()
    @IsInt()
    @Min(1)
    @Max(100)
    @ValidateIf(
        (self: CouponTypeBuyXGetYDto) =>
            self.getDiscountType === CouponTypeBuyXGetYGetDiscountTypesEnum.PERCENTAGE,
    )
    public getDiscountValue: number;

    // LIMITS
    @ApiProperty()
    @IsBoolean()
    public maxUsesPerOrder: boolean;

    @ApiProperty()
    @IsInt()
    @Min(1)
    @ValidateIf(
        (self: CouponTypeBuyXGetYDto) =>
            self.maxUsesPerOrder,
    )
    public maxUsesPerOrderValue: number;
}
