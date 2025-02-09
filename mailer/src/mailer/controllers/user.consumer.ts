import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { classToPlain } from 'class-transformer';
import { UserInterface } from '../interfaces';
import { UserSchemaName } from '../schemas';
import { UserDto } from '../dto/payment/business';
import { UserEventsRabbit } from '../enum';

@Controller()
export class UserConsumer {
  constructor(
    @InjectModel(UserSchemaName) private readonly userModel: Model<UserInterface>,
    private readonly logger: Logger,
  ) { }

  @MessagePattern({
    name: UserEventsRabbit.UserCreated,
  })
  public async onUserCreate(userDto: UserDto): Promise<void> {
    this.logger.log('received a user create event');
    await this.onUserCreateUpdateExport(userDto);
  }

  @MessagePattern({
    name: UserEventsRabbit.UserUpdated,
  })
  public async onUserUpdate(userDto: UserDto): Promise<void> {
    this.logger.log('received a user update event');
    await this.onUserCreateUpdateExport(userDto);
  }

  @MessagePattern({
    name: UserEventsRabbit.UserExport,
  })
  public async onUserExport(userDto: UserDto): Promise<void> {
    this.logger.log('received a user export event');
    await this.onUserCreateUpdateExport(userDto);
  }

  @MessagePattern({
    name: UserEventsRabbit.UserRemoved,
  })
  public async onBusinessRemovedEvent(data: any): Promise<void> {
    await this.userModel.deleteOne({ _id: data._id }).exec();
  }

  private async onUserCreateUpdateExport(userDto: UserDto): Promise<void> {
    this.logger.log('unwrapped data:' + JSON.stringify(userDto));
    const user: any = classToPlain(userDto);
    await this.userModel.findOneAndUpdate({ _id: user._id }, user, { upsert: true }).exec();
  }

  @MessagePattern({ 
    name: UserEventsRabbit.FixDifference,
  })
  public async fixUserDifference(payload: { users: string[] }): Promise<any> {
    const users: string[] = payload.users;
    const aconsumerUsers: UserInterface[] = await this.userModel.find({ }, { _id: true });
    const mailerUserIds: string[] = aconsumerUsers.map(user => user._id);
    const usersToDelete: string[] = mailerUserIds.filter((mailerUserId: string) => !users.includes(mailerUserId));
    await this.userModel.deleteMany({ _id: { $in: usersToDelete } });
  }
  
  }

