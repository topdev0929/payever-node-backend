import { Module } from '@nestjs/common';
import { ShippingResolver } from './shipping.resolver';

@Module({ providers: [ShippingResolver] })
export class ShippingModule { }
