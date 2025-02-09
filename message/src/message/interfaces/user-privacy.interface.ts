import { StatusEnum } from '../enums';

export interface UserPrivacyInterface {
  status: {
    showTo: StatusEnum;
  };
  forwardedMessage: {
    showTo: StatusEnum;
  };
  profilePhoto: {
    showTo: StatusEnum;
  };
  channelsAndGroups: {
    canAdd: StatusEnum;
  };
}
