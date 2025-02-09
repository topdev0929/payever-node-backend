import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import slugify from 'slugify';
import { MailAccessConfigSchemaName } from '../../mongoose-schema/mongoose-schema.names';
import { UpdateAccessConfigDto } from '../dto';
import { MailAccessConfigModel, MailModel } from '../models';

@Injectable()
export class MailAccessConfigService {
  constructor(
    @InjectModel(MailAccessConfigSchemaName)
    private readonly mailAccessConfigModel: Model<MailAccessConfigModel>,
  ) { }

  public async createOrUpdate(mail: MailModel, dto: UpdateAccessConfigDto): Promise<MailAccessConfigModel> {
    const currentAccessConfig: MailAccessConfigModel = await this.findByMail(mail);

    return !currentAccessConfig
      ? this.create(mail, dto)
      : this.update(currentAccessConfig, dto);
  }

  public async create(mail: MailModel, dto: UpdateAccessConfigDto): Promise<MailAccessConfigModel> {
    if (!dto.internalDomain) {
      dto = await this.generateInternalDomain(dto, mail.name);
    }

    if (await this.isDomainOccupied(mail.id, dto.internalDomain)) {
      const suffix: string = ('0000' + ((new Date()).getTime() % Math.pow(36, 4)).toString(36)).substr(-4);
      dto.internalDomain = dto.internalDomain + '-' + suffix;
      dto.internalDomainPattern = dto.internalDomainPattern + '-' + suffix;
    }

    return this.mailAccessConfigModel.create({
      ...dto,
      mail: mail,
    } as MailAccessConfigModel);
  }

  public async update(
    mailAccessConfig: MailAccessConfigModel,
    dto: UpdateAccessConfigDto,
  ): Promise<MailAccessConfigModel> {
    if (dto.internalDomain && await this.isDomainOccupied(mailAccessConfig.mail as any, dto.internalDomain)) {
      delete dto.internalDomain;
    }

    return this.mailAccessConfigModel.findOneAndUpdate(
      { _id: mailAccessConfig.id },
      { $set: dto },
      { new: true },
    );
  }

  public async findByMail(mail: MailModel): Promise<MailAccessConfigModel> {
    return this.mailAccessConfigModel.findOne({
      mail: mail,
    });
  }

  public async findOneByCondition(condition: any): Promise<MailAccessConfigModel> {
    return this.mailAccessConfigModel.findOne(condition);
  }

  public async findByMailOrCreate(mail: MailModel): Promise<MailAccessConfigModel> {
    const access: MailAccessConfigModel = await this.mailAccessConfigModel.findOne({
      mail: mail,
    });

    if (!access) {
      return this.create(mail, { });
    }

    return access;
  }

  public async setLive(mail: MailModel): Promise<void> {
    await this.mailAccessConfigModel.findOneAndUpdate(
      { mail: mail._id },
      {
        $set: {
          isLive: true,
        },
      },
    );
  }

  public async delete(mail: MailModel): Promise<MailAccessConfigModel> {
    const currentAccessConfig: MailAccessConfigModel = await this.findByMail(mail);

    if (currentAccessConfig) {
      currentAccessConfig.delete();
    }

    return currentAccessConfig;
  }

  private async generateInternalDomain(
    dto: UpdateAccessConfigDto,
    mailName: string,
  ): Promise<UpdateAccessConfigDto> {
    mailName = mailName.replace(/\./g, '');
    const domain: string = slugify(mailName).toLowerCase();
    dto.internalDomain = await this.isInternalDomainDuplicated(domain)
      ? await this.generateSuffixedDomain(domain)
      : domain
      ;
    dto.internalDomainPattern = dto.internalDomain;

    return dto;
  }

  private async isInternalDomainOccupied(domain: string): Promise<boolean> {
    const config: MailAccessConfigModel = await this.mailAccessConfigModel.findOne({
      internalDomain: domain,
    });

    return !!config;
  }

  private async isInternalDomainDuplicated(domain: string): Promise<boolean> {
    const config: MailAccessConfigModel = await this.mailAccessConfigModel.findOne({
      internalDomainPattern: domain,
    });

    return !!config;
  }

  private async generateSuffixedDomain(domain: string): Promise<string> {
    const suffix: string = ('0000' + ((new Date()).getTime() % Math.pow(36, 4)).toString(36)).substr(-4);
    const generated: string = domain + '-' + suffix;
    if (await this.isInternalDomainOccupied(generated)) {
      return this.generateSuffixedDomain(domain);
    }

    return generated;
  }

  private async isDomainOccupied(mailId: string, domain: string): Promise<boolean> {
    const config: MailAccessConfigModel = await this.mailAccessConfigModel.findOne({
      internalDomain: domain,
    });

    return !!config && config.mail as any !== mailId;
  }
}
