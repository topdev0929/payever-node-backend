import { AbstractWorld } from '@pe/cucumber-sdk';
import { setWorldConstructor, setDefaultTimeout } from '@cucumber/cucumber';
import { options } from './options';
import { ApplicationModule } from '../../src/app.module';

export class CustomWorld extends AbstractWorld {
  public constructor({ attach, parameters }) {
    super(
      { attach, parameters },
      ApplicationModule,
      options,
    );
  }
}

setDefaultTimeout(20000);
setWorldConstructor(CustomWorld);
