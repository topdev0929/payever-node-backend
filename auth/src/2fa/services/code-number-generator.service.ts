import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { SecondFactorTokenInterface } from '../interfaces';
import { SecondFactorTokenSchemaName } from '../schemas';

@Injectable()
export class CodeNumberGenerator {
  constructor(
    @InjectModel(SecondFactorTokenSchemaName)
    private readonly secondFactorTokenModel: Model<SecondFactorTokenInterface>,
  ) { }

  public async generate(userId: string): Promise<number> {
    let code: number;
    let existingCode: SecondFactorTokenInterface;

    do {
      code = CodeNumberGenerator.getRandomInt(100000, 999999);

      existingCode = await this.secondFactorTokenModel.findOne({ userId, code, active: true }).exec();
    } while (existingCode);

    return code;
  }

  private static getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
