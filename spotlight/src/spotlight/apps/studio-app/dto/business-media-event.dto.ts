import { MediaTypeEnum } from '../enums';

export class BusinessMediaEventDto{
  public id: string;
  public business: {
    id: string;
  };
  public mediaType: MediaTypeEnum;
  public name: string;
  public url: string;
}
