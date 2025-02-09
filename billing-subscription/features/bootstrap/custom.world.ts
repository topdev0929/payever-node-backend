import { AbstractWorld } from '@pe/cucumber-sdk/module/abstract.world';
import { setWorldConstructor } from '@cucumber/cucumber';
import { options } from './options';
import { ApplicationModule } from '../../src/app.module';

export class CustomWorld extends AbstractWorld {
  public constructor({ attach, parameters }: { attach: () => any; parameters: { [key: string]: any } }) {
    super({ attach, parameters }, ApplicationModule, options);
  }
}

setWorldConstructor(CustomWorld);
