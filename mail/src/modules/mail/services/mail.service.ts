import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { environment } from '../../../environments';
import { BusinessDto } from '../../business/dto';
import { BusinessModel } from '../../business/models';
import { MailSchemaName } from '../../mongoose-schema/mongoose-schema.names';
import { AdminMailListDto, CreateMailDto } from '../dto';
import { MailAndAccessInterface } from '../interfaces';
import { MailAccessConfigModel, MailModel } from '../models';
import { MailRabbitEventsProducer } from '../producers';
import { MailAccessConfigService } from './mail-access-config.service';

@Injectable()
export class MailService {
  constructor(
    @InjectModel(MailSchemaName) private readonly mailModel: Model<MailModel>,
    private readonly mailAccessConfigService: MailAccessConfigService,
    private readonly mailRabbitEventsProducer: MailRabbitEventsProducer,
  ) { }

  public async createByBusiness(
    dto: BusinessDto,
  ): Promise<MailModel> {
    const mail: MailModel = await this.upsert(dto);

    this.mailRabbitEventsProducer.mailCreated(mail).catch();
    this.mailAccessConfigService.createOrUpdate(mail, { }).catch();

    return mail;
  }

  public async exportByBusiness(
    dto: BusinessDto,
  ): Promise<MailModel> {
    const mail: MailModel = await this.upsert(dto);
    this.mailRabbitEventsProducer.mailExport(mail).catch();
    this.mailAccessConfigService.createOrUpdate(mail, { }).catch();

    return mail;
  }

  public async create(
    businessId: string,
    dto: CreateMailDto,
  ): Promise<MailAndAccessInterface> {
    await this.validateMailName(dto.name, businessId);

    const mail: MailModel = await this.mailModel.create({
      businessId,
      name: dto.name,
    });
    this.mailRabbitEventsProducer.mailCreated(mail).catch();
    const mailAccessConfig: MailAccessConfigModel = await this.mailAccessConfigService.createOrUpdate(mail, { });

    return { mail: mail, access: mailAccessConfig };
  }

  /** @TODO: Validate mail name with class-validator constraint */
  public async validateMailName(
    name: string,
    businessId: string,
  ): Promise<boolean> {
    if (!name) {
      throw new Error(`Name must be not empty`);
    }

    const mail: MailModel = await this.mailModel.findOne({
      businessId: businessId,
      name: name,
    });

    if (mail) {
      throw new BadRequestException(
        `Mail with name "${name}" already exists for business: "${businessId}"`,
      );
    }

    return true;
  }

  public async upsert(
    dto: BusinessDto,
  ): Promise<MailModel> {
    return this.mailModel.findOneAndUpdate(
      {
        _id: dto._id,
      },
      {
        $set: {
          businessId: dto._id, // it looks strange, that _id is used in filter and in set for different fields.
          name: dto.name,
        },
      },
      {
        new: true,
        setDefaultsOnInsert: true,
        upsert: true,
      },
    );
  }

  public async findOneById(mailId: string): Promise<MailModel> {
    return this.mailModel.findOne({ _id: mailId });
  }

  public async findByBusinessId(businessId: string): Promise<MailModel> {
    return this.mailModel.findOne({ businessId: businessId });
  }

  public async removeById(mailId: string): Promise<MailModel> {
    await this.mailRabbitEventsProducer.mailRemoved({ id: mailId });

    return this.mailModel.findOneAndDelete({ _id: mailId });
  }

  public async findWithAccessConfigByMail(mail: MailModel): Promise<any> {
    const accessConfig: MailAccessConfigModel = await this.mailAccessConfigService.findByMail(mail);

    return {
      ...mail.toObject(),
      accessConfig: accessConfig?.toObject(),
    };
  }

  public async findWithAccessConfigByBusiness(business: BusinessModel): Promise<any> {
    const mails: MailModel[] = await this.mailModel.find({ businessId: business.id }).sort({ createdAt: -1 });

    const result: any[] = [];

    for (const mail of mails) {
      const accessConfig: MailAccessConfigModel = await this.mailAccessConfigService.findByMail(mail);

      result.push({
        ...mail.toObject(),
        accessConfig: accessConfig?.toObject(),
      });
    }

    return result;
  }

  public async getByDomain(domain: string): Promise<MailAccessConfigModel> {
    const mailDomain: string = (environment.mailDomain || '').replace('DOMAIN.', '');
    const condition: any = domain.endsWith(mailDomain)
      ? { internalDomain: domain.replace('.' + mailDomain, '') }
      : { internalDomain: domain };

    return this.mailAccessConfigService.findOneByCondition(condition);
  }

  public async update(
    mail: MailModel,
    businessId: string,
    dto: Partial<CreateMailDto>,
  ): Promise<any> {

    await this.validateMailName(dto.name, businessId);

    mail = await this.mailModel.findOneAndUpdate(
      { _id: mail._id },
      {
        $set: dto,
      },
      { new: true },
    ).exec();

    const mailAccessConfig: MailAccessConfigModel = await this.mailAccessConfigService.createOrUpdate(mail, { });

    return { mail, access: mailAccessConfig };
  }

  public async delete(
    mail: MailModel,
  ): Promise<{ mail: MailModel, access: MailAccessConfigModel }> {
    await this.mailModel.deleteOne(
      { _id: mail._id },
    );

    const mailAccessConfig: MailAccessConfigModel = await this.mailAccessConfigService.delete(mail);

    return { mail, access: mailAccessConfig };
  }

  public async retrieveListForAdmin(query: AdminMailListDto): Promise<any> {
    const limit: number = query.limit * 1 || 100;
    const page: number = query.page * 1 || 1;
    const offset: number = (page - 1) * limit;

    const conditions: any = { };

    if (query.businessIds) {
      conditions.businessId = { $in: query.businessIds };
    }

    if (query.searchString) {
      conditions.$text = { $search: query.searchString };
    }

    const mails: MailModel[] = await this.mailModel
      .find(conditions)
      .select(query.projection)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);

    const total: number = await this.mailModel.count();

    return {
      mails,
      page,
      total,
    };
  }
}
