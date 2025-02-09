import { AbstractWorld } from '@pe/cucumber-sdk';
import { setWorldConstructor } from '@cucumber/cucumber';
import { ApplicationModule } from '../../src/app.module';
import { options } from './options';
import { INestApplication } from '@nestjs/common';

export class CustomWorld extends AbstractWorld {
  protected application: INestApplication;
  public constructor({ attach, parameters }: { attach: any, parameters: any }) {
    super(
      { attach, parameters },
      ApplicationModule,
      options,
    );
  }
}

setWorldConstructor(CustomWorld);
