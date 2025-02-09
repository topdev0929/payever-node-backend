import { AbstractWorld } from '@pe/cucumber-sdk';
import { setWorldConstructor } from '@cucumber/cucumber';
import { options } from './options';
import { AppModule } from '../../src/app.module';

export class CustomWorld extends AbstractWorld {
  public constructor({ attach, parameters }: { attach: () => any; parameters: { [key: string]: any } }) {
    super({ attach, parameters }, AppModule, options);
  }
}

setWorldConstructor(CustomWorld);
