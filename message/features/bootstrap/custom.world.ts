import { AbstractWorld } from '@pe/cucumber-sdk';
import { setWorldConstructor, setDefaultTimeout } from '@cucumber/cucumber';

import { CucumberAppModule } from '../cucumberapp.module';
import { options } from './options';

export class CustomWorld extends AbstractWorld {
  public constructor({ attach, parameters }) {
    super(
      { attach, parameters },
      CucumberAppModule,
      options,
    );
  }
}

setWorldConstructor(CustomWorld);
setDefaultTimeout(20 * 1000);
