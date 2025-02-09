import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { SignupsDto } from './signups.dto';
import { SignupModel } from './signup.model';
import { SignupsSchemaName } from './signup.schema';
import { EventDispatcher } from '@pe/nest-kit';
import { SignupsEventsEnum } from './signups-events.enum';

@Injectable()
export class SignupsService {
  constructor(
    @InjectModel(SignupsSchemaName) private readonly signupsModel: Model<SignupModel>,
    private readonly eventDispatcher: EventDispatcher,
    private readonly logger: Logger,
  ) { }

  public async create(dto: SignupsDto): Promise<SignupModel> {
    if (await this.signupsModel.findOne({ email: dto.email})) {
      throw new BadRequestException(`Signup with email ${dto.email} already exists`);
    }

    const signupRecord: SignupModel = await this.signupsModel.create(dto as SignupModel);

    await this.eventDispatcher.dispatch(SignupsEventsEnum.SignupCreated, signupRecord);

    return signupRecord;
  }

  public async connectSignupToCrmContactId(email: string, contactId: number): Promise<void> {
    const signup: SignupModel = await this.signupsModel.findOne({ email, baseCrmContactId: null });

    if (!signup) {
      this.logger.warn(`Signup with email ${email} not found. Can not connect CRM contact ${contactId}`);

      return;
    }

    await this.signupsModel.findByIdAndUpdate(signup.id, {
      $set: { baseCrmContactId: contactId },
    });

    this.logger.warn(`Signup with email ${email} has been connected to CRM contact ${contactId}`);
  }

  public async getSignupsByCriteria(criteria: { }): Promise<SignupModel[]> {
    return this.signupsModel.find(criteria);
  }

  public async markSignupAsContacted(signup: SignupModel): Promise<SignupModel> {
    return this.signupsModel.findByIdAndUpdate(signup.id, { $set: { contacted: true } }, { new: true });
  }

  public async registerFollowupSent(signup: SignupModel, followupId: number): Promise<SignupModel> {
    return this.signupsModel.findByIdAndUpdate(signup.id, { $push: { followupsSent: followupId } });
  }
}
