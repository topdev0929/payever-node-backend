import { Injectable } from '@nestjs/common';
import { UserMailDto } from '../dto';
import { MailDto } from '../dto/nodemailer';
import { UserMailTransformer } from '../transformers';
import { SenderService } from './sender.service';
import { ServerTypeEnum } from '../enum';

@Injectable()
export class UserService {
  constructor(
    private readonly userMailTransformer: UserMailTransformer,
    private readonly sendService: SenderService,
  ) { }

  public async sendUserEmail(userMailDto: UserMailDto): Promise<void> {
    const dto: MailDto = await this.userMailTransformer.transform(userMailDto);

    if (userMailDto.subject) {
      dto.subject = userMailDto.subject;
    }

    dto.serverType = userMailDto.serverType || ServerTypeEnum.payever;

    await this.sendService.send(dto);
  }
}
