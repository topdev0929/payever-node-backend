import { AbstractWorld } from '@pe/cucumber-sdk';
import { setWorldConstructor } from '@cucumber/cucumber';
import { ApplicationModule } from '../../src/app.module';
import { options } from './options';

export class CustomWorld extends AbstractWorld {
  public constructor({ attach, parameters }: {
    attach: any;
    parameters: any;
  }) {
    super(
      { attach, parameters },
      ApplicationModule,
      options,
    );
  }
}

setWorldConstructor(CustomWorld);
