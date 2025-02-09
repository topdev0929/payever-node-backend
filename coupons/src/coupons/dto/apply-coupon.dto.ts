import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    IsEmail,
    IsArray,
    IsOptional,
} from 'class-validator';
import { CartItemInterface } from '../interfaces';

export class ApplyCouponDto {
    @ApiProperty()
    @IsArray()
    public cart: CartItemInterface[];

    @ApiProperty()
    @IsString()
    public couponCode: string;

    @ApiProperty()
    @IsEmail()
    public customerEmail: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    public shippingCountry: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    public channelSet?: string;
}
