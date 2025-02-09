import { MediaTypeEnum } from '../enums';
import { ImageAssessmentInterface } from './image-assessment.interface';
import { MediaAttributeInterface } from './media-attribute-interface';
import { UserMediaAttributeInterface } from './user-media-attribute-interface';

export interface UserMediaInterface {
  attributes?: MediaAttributeInterface[];
  userAttributes?: UserMediaAttributeInterface[];
  url: string;
  assessment?: ImageAssessmentInterface;
  mediaType: MediaTypeEnum;
  name: string;
  businessId: string;
  description?: string;
  album?: string;
  example?: boolean;
  text?: any;
}
