import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { BusinessModel } from '../../../src/business';

export const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

export abstract class CommonFixture extends BaseFixture {
  protected readonly businessModel: Model<BusinessModel> = this.application.get('BusinessModel');
}

