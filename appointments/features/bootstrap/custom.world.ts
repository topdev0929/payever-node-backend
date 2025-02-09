import { AbstractWorld } from '@pe/cucumber-sdk';
import { setWorldConstructor, setDefaultTimeout } from '@cucumber/cucumber';

import { AppModule } from '../../src/app.module';
import { options } from './options';

export class CustomWorld extends AbstractWorld {
  public constructor({ attach, parameters }) {
    super(
      { attach, parameters },
      AppModule,
      options,
    );
  }
}

setDefaultTimeout(20000);
setWorldConstructor(CustomWorld);
