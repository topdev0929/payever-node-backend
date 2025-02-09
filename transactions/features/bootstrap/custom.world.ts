import { AbstractWorld } from '@pe/cucumber-sdk';
import { setDefaultTimeout, setWorldConstructor } from '@cucumber/cucumber';
import { AppModule } from '../../src/app.module';
import { options } from './options';

export class CustomWorld extends AbstractWorld {
  public constructor({ attach, parameters }: { attach: any, parameters: any }) {
    super(
      { attach, parameters},
      AppModule,
      options,
    );
  }
}

setDefaultTimeout(40000);
setWorldConstructor(CustomWorld);
