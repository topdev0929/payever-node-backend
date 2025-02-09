import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import * as sanitizeHtml from 'sanitize-html';
import { BusinessSchemaName } from '../schemas';
import { BusinessMailDto } from '../dto';
import { MailDto } from '../dto/nodemailer';
import { BusinessMailTransformer } from '../transformers';
import { SenderService } from './sender.service';
import { BusinessInterface, UserInterface } from '../interfaces';
import { EventDispatcher } from '@pe/nest-kit';
import { MailerEventsProducer } from '../producers';
import { ServerTypeEnum } from '../enum';

@Injectable()
export class BusinessService {
  constructor(
    @InjectModel(BusinessSchemaName) private readonly businessModel: Model<BusinessInterface & Document>,
    private readonly businessMailTransformer: BusinessMailTransformer,
    private readonly sendService: SenderService,
    private readonly eventDispatcher: EventDispatcher,
    private readonly mailerEventsProducer: MailerEventsProducer,
  ) { }

  public async findOneById(businessId: string): Promise<BusinessInterface & Document> {
    return this.businessModel.findById(businessId);
  }

  public async sendBusinessEmail(businessMailDto: BusinessMailDto): Promise<void> {
    const business: BusinessInterface & Document = await this.businessModel.findOne({
      _id: businessMailDto.businessId,
    }).exec();

    if (!business) {
      throw new NotFoundException(`Business "${businessMailDto.businessId}" not found`);
    }

    await business.populate('owner').execPopulate();

    const dto: MailDto = await this.businessMailTransformer.transform(
      businessMailDto,
      business,
      business.owner as UserInterface,
    );

    dto.serverType = businessMailDto.serverType || ServerTypeEnum.payever;

    await this.sendEmail(businessMailDto, dto, business);
  }

  public async sendHtmlIntegrationMail(businessMailDto: BusinessMailDto): Promise<any> {
    const business: BusinessInterface & Document = await this.businessModel.findOne({
      _id: businessMailDto.businessId,
    }).exec();

    if (!business) {
      throw new NotFoundException(`Business "${businessMailDto.businessId}" not found`);
    }

    await business.populate('owner').execPopulate();

    const dto: MailDto = new MailDto();
    dto.subject = businessMailDto.subject;
    dto.html = businessMailDto.variables.html;

    const regex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
    while (regex.test(dto.html)) {
      dto.html = dto.html.replace(regex, '');
    }
    dto.html = sanitizeHtml(dto.html);

    return this.sendEmail(businessMailDto, dto, business);
  }

  private async sendEmail(
    businessMailDto: BusinessMailDto,
    dto: MailDto,
    business: BusinessInterface & Document,
  ): Promise<any> {
    if (businessMailDto.to) {
      dto.to = businessMailDto.to;
    } else {
      dto.to = business.contactEmails.join('; ');
    }
    if (businessMailDto.subject) {
      dto.subject = businessMailDto.subject;
    }

    await this.sendService.send(dto);
    await this.mailerEventsProducer.produceBusinessMailSentEvent(businessMailDto);

    return dto;
  }
}
