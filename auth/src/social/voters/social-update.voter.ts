import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AbstractVoter, AccessTokenPayload, Voter } from '@pe/nest-kit';
import { SocialModel } from '../models';
import { SocialSchemaName } from '../schemas';

@Voter()
@Injectable()
export class SocialUpdateVoter extends AbstractVoter {
  public static readonly UPDATE: string = 'social-update';

  constructor(
    @InjectModel(SocialSchemaName) private readonly socialModel: Model<SocialModel>,
  ) {
    super();
  }

  protected async supports(attribute: string): Promise<boolean> {
    return attribute === SocialUpdateVoter.UPDATE;
  }

  protected async voteOnAttribute(
    attribute: string,
    socialId: string,
    user: AccessTokenPayload,
  ): Promise<boolean> {
    return !!(await this.socialModel.findOne({ _id: socialId, userId: user.id }));
  }
}
