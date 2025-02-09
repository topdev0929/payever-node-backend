import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';

import { RegisterEvent } from '../../users/interfaces';
import { REGISTER_EVENT } from '../../users/constants';

import { BlockEmailService } from '../services';
import { BanReasonsEnum } from '../enums/ban-reasons';
import { BlockedException } from '../exceptions';

@Injectable()
export class RegisterListener {
  constructor(
    private readonly blockEmailService: BlockEmailService,
  ) { }

  @EventListener(REGISTER_EVENT)
  public async onRegisterEvent(data: RegisterEvent): Promise<void> {
    const userEmail: string = data.registerDto ? data.registerDto.email : null;

    if (await this.blockEmailService.checkBlocked(userEmail)) {
      throw new BlockedException(BanReasonsEnum.REASON_EMAIL_BAN_REGISTER);
    }
  }
}
