import { Types, Schema } from 'mongoose';
import { SchemaFactory, Schema as SchemaDecorator, Prop, PropOptions } from '@nestjs/mongoose';

import { StatusEnum } from '../enums';
import { UserPrivacyInterface } from '../interfaces';

const privacyItemType: PropOptions = {
  default: StatusEnum.Everybody,
  enum: Object.values(StatusEnum),
  type: String,
};

@SchemaDecorator({
  _id: false,
  id: false,
})
export class UserPrivacy implements UserPrivacyInterface {
  @Prop({
    type: {
      canAdd: privacyItemType,
    },
  })
  public channelsAndGroups: {
    canAdd: StatusEnum;
  };

  @Prop({
    type: {
      showTo: privacyItemType,
    },
  })
  public forwardedMessage: {
    showTo: StatusEnum;
  };

  @Prop({
    type: {
      showTo: privacyItemType,
    },
  })
  public profilePhoto: {
    showTo: StatusEnum;
  };

  @Prop({
    type: {
      showTo: privacyItemType,
    },
  })
  public status: {
    showTo: StatusEnum;
  };
}

export interface UserPrivacyEmbeddedDocument extends Types.Subdocument, UserPrivacy { }

export const UserPrivacySchema: Schema<UserPrivacyEmbeddedDocument> =
  SchemaFactory.createForClass(UserPrivacy);
