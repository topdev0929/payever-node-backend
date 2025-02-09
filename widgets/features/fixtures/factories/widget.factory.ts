import { 
  partialFactory, 
  SequenceGenerator, 
  uniqueString, 
  PartialFactory, 
  DefaultFactory,
} from '@pe/cucumber-sdk';
import { v4 } from 'uuid';

const seq: SequenceGenerator = new SequenceGenerator();

export const widgetDefaultFactory: DefaultFactory<any> = (): any => {
  seq.next();

  return {
    _id: v4(),
    default: false,
    helpURL: `https://test.com/${uniqueString()}`,
    icon: uniqueString(),
    order: 1,
    title: `widget ${seq.current}`,
    tutorial: {
      icon: uniqueString(),
      title: `Widget ${seq.current} tutorial`,
      url: `https://test.com/${uniqueString()}`,
    },
    type: `widget-type-${uniqueString()}`,
  };
};

export const widgetFactory: PartialFactory<any> = partialFactory<any>(widgetDefaultFactory);
