import { AbstractWorld } from '@pe/cucumber-sdk';
import { setWorldConstructor } from '@cucumber/cucumber';
import { options } from './options';
import { EmitterConsumerInitializer } from '../../src/transactions/emitter';
import { ApplicationModule } from '../../src/app.module';

export class CustomWorld extends AbstractWorld {
  public constructor({attach, parameters}) {
    super(
      {attach, parameters},
      ApplicationModule,
      options,
    );
  }
}

setWorldConstructor(CustomWorld);
