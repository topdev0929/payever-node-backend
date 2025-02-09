import { AbstractWorld } from '@pe/cucumber-sdk/module/abstract.world';
import { setWorldConstructor } from '@cucumber/cucumber';
import { options } from './options';
import { AppModule } from '../../src/app.module';

export class CustomWorld extends AbstractWorld {
  public constructor({ attach, parameters }: { attach: () => any; parameters: {  } }) {
    super({ attach, parameters }, AppModule, options);
  }
}

setWorldConstructor(CustomWorld);
