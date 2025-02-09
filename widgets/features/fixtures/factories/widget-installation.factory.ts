import { 
  partialFactory, 
  SequenceGenerator, 
  PartialFactory, 
  DefaultFactory,
} from '@pe/cucumber-sdk';
import { v4 } from 'uuid';

const seq: SequenceGenerator = new SequenceGenerator();

export const widgetDefaultFactory: DefaultFactory<any> = (): any => {
  seq.next();

  return {
    _id: v4(),
    installed: false,
    order: 1,
    widget: v4(),
  };
};

export const widgetInstallFactory: PartialFactory<any> = partialFactory<any>(widgetDefaultFactory);
