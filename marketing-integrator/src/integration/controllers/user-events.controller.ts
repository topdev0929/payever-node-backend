import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RabbitRoutingKeysEnum } from '../enum';
import { AccountDto } from '../dto';
import { SignupsService } from '../../signups';
import { AccountToSignupConverter } from '../converter';

@Controller()
export class UserEventsController {
  constructor(
    private readonly signupsService: SignupsService,
  ) { }

  @MessagePattern({
    name: RabbitRoutingKeysEnum.AccountCreated,
  })
  public async onUserCreated(dto: AccountDto): Promise<void> {
    await this.signupsService.create(AccountToSignupConverter.convert(dto));
  }
}
