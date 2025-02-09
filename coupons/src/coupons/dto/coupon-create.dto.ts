import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsString,
    IsUUID,
    IsOptional,
    IsDate,
    IsBoolean,
    IsEnum,
    Matches,
    ValidateNested,
    ValidateIf,
    ArrayMinSize,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { CouponLimitDto } from './coupon-limit.dto';
import { CouponTypeDto } from './coupon-type.dto';
import {
    CouponsStatusEnum,
    CouponTypeEnum,
    CouponTypeCustomerEligibilityEnum ,
} from '../enum';

import { manualRegExp as manualCouponRegExp } from '../types/coupon-code.type';
import {
    CouponTypePercentageDto,
    CouponTypeFixedDto,
    CouponTypeFreeShippingDto,
    CouponTypeBuyXGetYDto,
} from './coupon-type';
import { CouponInterface } from '../schemas';
import { IsDateLessThan } from '../decorators/is-less-than.decorator';
import { IsDateGreaterThan } from '../decorators/is-greater-than.decorator';

export class CreateCouponDto<T extends CouponTypeDto = CouponTypeDto>  implements Omit<CouponInterface, 'businessId'> {
    @ApiProperty()
    @IsNotEmpty()
    @IsString({ each: true })
    public channelSets: string[];

    @ApiProperty()
    @IsOptional()
    @IsNotEmpty()
    @Transform((value: string) => typeof value === 'string' && value.toUpperCase())
    @Matches(manualCouponRegExp)
    public code: string;

    @ApiProperty()
    @IsString()
    public description: string;

    @ApiProperty()
    @IsOptional()
    @Transform((value: string) => new Date(value))
    @IsDate()
    @IsDateGreaterThan('startDate', { message: 'The end date must be after the start date' })
    public endDate: Date;

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    public isAutomaticDiscount: boolean = false;

    @ApiProperty()
    @Type(() => CouponLimitDto)
    @ValidateNested()
    public limits: CouponLimitDto;

    @ApiProperty()
    @IsString()
    public name: string;

    @ApiProperty()
    @Transform((value: string) => new Date(value))
    @IsDate()
    @IsDateLessThan('endDate', { message: 'The start date must be before the end date' })
    public startDate: Date;

    @ApiProperty()
    @IsEnum(CouponsStatusEnum)
    public status: CouponsStatusEnum = CouponsStatusEnum.INACTIVE;

    @ApiProperty({
        type: CouponTypeDto,
    })
    @ValidateNested()
    @Type(() => CouponTypeDto, {
        discriminator: {
            property: 'type',
            subTypes: [{
                name: CouponTypeEnum.PERCENTAGE,
                value: CouponTypePercentageDto,
            }, {
                name: CouponTypeEnum.FIXED_AMOUNT,
                value: CouponTypeFixedDto,
            }, {
                name: CouponTypeEnum.FREE_SHIPPING,
                value: CouponTypeFreeShippingDto,
            }, {
                name: CouponTypeEnum.BUY_X_GET_Y,
                value: CouponTypeBuyXGetYDto,
            }],
        },
        keepDiscriminatorProperty: true,
    })
    public type: T;

    @ApiProperty({
        enum: CouponTypeCustomerEligibilityEnum,
    })
    @IsEnum(CouponTypeCustomerEligibilityEnum)
    public customerEligibility: CouponTypeCustomerEligibilityEnum;

    @ApiProperty()
    @ValidateIf(
        (self: CreateCouponDto<T>) =>
            self.customerEligibility === CouponTypeCustomerEligibilityEnum.SPECIFIC_GROUPS_OF_CUSTOMERS,
    )
    @IsNotEmpty()
    @ArrayMinSize(1)
    @IsUUID('4', { each: true })
    public customerEligibilityCustomerGroups: string[];

    @ApiProperty()
    @ValidateIf(
        (self: CreateCouponDto<T>) =>
            self.customerEligibility === CouponTypeCustomerEligibilityEnum.SPECIFIC_CUSTOMERS,
    )
    @IsString({ each: true })
    @IsNotEmpty()
    @ArrayMinSize(1)
    public customerEligibilitySpecificCustomers: string[];

    @ApiProperty({ required: false })
    @IsUUID('4')
    @IsOptional()
    public parentFolderId?: string;

    public static couponIsFixedAmountType(dto: CreateCouponDto): dto is CreateCouponDto<CouponTypeFixedDto> {
        return dto.type.type === CouponTypeEnum.FIXED_AMOUNT;
    }

    public static couponIsPercentageType(dto: CreateCouponDto): dto is CreateCouponDto<CouponTypePercentageDto> {
        return dto.type.type === CouponTypeEnum.PERCENTAGE;
    }

    public static couponIsFreeShippingType(dto: CreateCouponDto): dto is CreateCouponDto<CouponTypeFreeShippingDto> {
        return dto.type.type === CouponTypeEnum.FREE_SHIPPING;
    }

    public static couponIsBuyXGetYType(dto: CreateCouponDto): dto is CreateCouponDto<CouponTypeBuyXGetYDto> {
        return dto.type.type === CouponTypeEnum.BUY_X_GET_Y;
    }
}
