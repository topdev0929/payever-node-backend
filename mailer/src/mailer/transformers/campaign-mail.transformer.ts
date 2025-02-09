import { CampaignMailDto, MailDto } from '../dto';
import { plainToClass } from 'class-transformer';
import { Injectable } from '@nestjs/common';
import { ServerTypeEnum } from '../enum';

@Injectable()
export class CampaignMailTransformer {
  constructor(
  ) {
  }

  public static transform(builderMailDto: CampaignMailDto): MailDto[] {
    const result: MailDto[] = [];
    const temp: any = { ...builderMailDto };
    delete temp.to;

    for (const to of builderMailDto.to) {
      result.push(plainToClass(MailDto, {
        ...temp,
        serverType: builderMailDto.serverType || ServerTypeEnum.payever,
        to: to,
      }));
    }

    return result;
  }
}
