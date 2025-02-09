import { MediaTypeEnum, SubscriptionMediaTypeEnum } from '../enums';
import { ImageAssessmentInterface } from './image-assessment.interface';
import { MediaAttributeInterface } from './media-attribute-interface';

export interface SubscriptionMediaInterface {
  assessment?: ImageAssessmentInterface;
  attributes?: MediaAttributeInterface[];
  compressed?: boolean;
  compressionTries?: number;
  url: string;
  mediaType: MediaTypeEnum;
  name: string;
  subscriptionType?: SubscriptionMediaTypeEnum;
}
