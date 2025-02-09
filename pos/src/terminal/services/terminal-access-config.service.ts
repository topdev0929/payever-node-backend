import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TerminalAccessConfigModel, TerminalModel } from '../models';
import { TerminalAccessConfigSchemaName } from '../../mongoose-schema/mongoose-schema.names';
import { UpdateAccessConfigDto } from '../dto';
import { environment } from '../../environments';
import { EventDispatcher } from '@pe/nest-kit';
import { TerminalEvent } from '../event-listeners';
import { MongoError } from 'mongodb';
import { DomainHelper } from '../helpers';

@Injectable()
export class TerminalAccessConfigService {
  constructor(
    @InjectModel(TerminalAccessConfigSchemaName)
    private readonly terminalAccessConfigModel: Model<TerminalAccessConfigModel>,
    private readonly dispatcher: EventDispatcher,
  ) { }

  public async createOrUpdate(terminal: TerminalModel, dto: UpdateAccessConfigDto): Promise<TerminalAccessConfigModel> {
    const currentAccessConfig: TerminalAccessConfigModel = await this.findByTerminal(terminal);
    let updatedAccessConfig: TerminalAccessConfigModel;

    try {
      updatedAccessConfig = !currentAccessConfig
        ? await this.create(terminal, dto)
        : await this.update(terminal, currentAccessConfig, dto);
    } catch (e) {
      if (e instanceof MongoError && e.code === 11000) {
        throw new ConflictException(`Access config internal domain already used`);
      }
      throw e;
    }

    if (dto.internalDomain) {
      await this.dispatcher.dispatch(
        TerminalEvent.DomainUpdated,
        terminal._id,
        `${dto.internalDomain}.${environment.posDomain}`,
      );
    }

    return updatedAccessConfig;
  }

  public async create(terminal: TerminalModel, dto: UpdateAccessConfigDto): Promise<TerminalAccessConfigModel> {
    if (!dto.internalDomain) {
      dto = await this.generateInternalDomain(dto, terminal.name);
    }

    dto.internalDomain = DomainHelper.nameToDomain(dto.internalDomain ? dto.internalDomain : terminal.name);
    dto.internalDomainPattern =
      DomainHelper.nameToDomain(dto.internalDomainPattern ? dto.internalDomainPattern : terminal.name);

    if (await this.isDomainOccupied(dto.internalDomain, terminal._id)) {
      const suffix: string
        = ('0000' + ((new Date()).getTime() % Math.pow(36, 4)).toString(36)).substr(-4);
      dto.internalDomain = dto.internalDomain + '-' + suffix;
      dto.internalDomainPattern = dto.internalDomainPattern + '-' + suffix;
    }

    return this.terminalAccessConfigModel.create({
      ...dto,
      terminal: terminal,
    } as TerminalAccessConfigModel);
  }

  public async update(
    terminal: TerminalModel,
    terminalAccessConfig: TerminalAccessConfigModel,
    dto: UpdateAccessConfigDto,
  ): Promise<TerminalAccessConfigModel> {
    dto.internalDomain = DomainHelper.nameToDomain(dto.internalDomain ? dto.internalDomain : terminal.name);
    dto.internalDomainPattern =
      DomainHelper.nameToDomain(dto.internalDomainPattern ? dto.internalDomainPattern : terminal.name);

    if (await this.isDomainOccupied(dto.internalDomain, terminalAccessConfig.terminal._id)) {
      const suffix: string
        = ('0000' + ((new Date()).getTime() % Math.pow(36, 4)).toString(36)).substr(-4);
      dto.internalDomain = dto.internalDomain + '-' + suffix;
      dto.internalDomainPattern = dto.internalDomainPattern + '-' + suffix;
    }

    return this.terminalAccessConfigModel.findOneAndUpdate(
      { _id: terminalAccessConfig.id },
      { $set: dto },
      { new: true },
    );
  }

  public async findById(id: string): Promise<TerminalAccessConfigModel> {
    return this.terminalAccessConfigModel.findOne({
      _id: id,
    });
  }

  public async findByTerminal(terminal: TerminalModel): Promise<TerminalAccessConfigModel> {
    return this.terminalAccessConfigModel.findOne({
      terminal: terminal,
    });
  }

  public async findByTerminalOrCreate(terminal: TerminalModel): Promise<TerminalAccessConfigModel> {
    const access: TerminalAccessConfigModel = await this.terminalAccessConfigModel.findOne({
      terminal: terminal,
    });

    if (!access) {
      return this.create(terminal, { });
    }

    return access;
  }

  public async setLive(terminal: TerminalModel): Promise<void> {
    await this.terminalAccessConfigModel.findOneAndUpdate(
      { terminal: terminal._id },
      {
        $set: {
          isLive: true,
        },
      },
    );
  }

  public async getByDomain(domain: string): Promise<TerminalAccessConfigModel> {
    const posDomain: string = environment.posDomain;
    const conditionValue: string = (domain.endsWith(posDomain)) ? domain.replace('.' + posDomain, '') : domain;

    return this.terminalAccessConfigModel.findOne({ internalDomain: conditionValue })
      .populate('terminal')
      .exec();
  }

  private async generateInternalDomain(
    dto: UpdateAccessConfigDto,
    terminalName: string,
  ): Promise<UpdateAccessConfigDto> {
    const domain: string = DomainHelper.nameToDomain(terminalName);
    dto.internalDomainPattern = domain;
    dto.internalDomain = await this.isInternalDomainDuplicated(domain)
      ? await this.generateSuffixedDomain(domain)
      : domain
      ;

    return dto;
  }

  private async isInternalDomainOccupied(domain: string): Promise<boolean> {
    const config: TerminalAccessConfigModel = await this.terminalAccessConfigModel.findOne({
      internalDomain: domain,
    });

    return !!config;
  }

  private async isInternalDomainDuplicated(domain: string): Promise<boolean> {
    const config: TerminalAccessConfigModel = await this.terminalAccessConfigModel.findOne({
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

  private async isDomainOccupied(domain: string, currentTerminalId: string): Promise<boolean> {
    const config: TerminalAccessConfigModel = await this.terminalAccessConfigModel.findOne({
      internalDomainPattern: DomainHelper.nameToDomain(domain),
    });

    return !!config && config.terminal !== currentTerminalId as any;
  }
}
