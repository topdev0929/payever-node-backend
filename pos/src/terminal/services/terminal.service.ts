import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryCursor } from 'mongoose';
import { fromEvent, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';

import {
  CHANNEL_SET_SERVICE,
  ChannelEventMessagesProducer,
  ChannelModel,
  ChannelService,
  ChannelSetModel,
  ChannelSetServiceInterface,
  ChannelSubTypeEnum,
} from '@pe/channels-sdk';
import { EventDispatcher } from '@pe/nest-kit';
import { BusinessModel } from '../../business/models';
import { BusinessSchemaName, TerminalSchemaName } from '../../mongoose-schema/mongoose-schema.names';
import { CreateTerminalDto, UpdateTerminalDto, AdminTerminalListDto } from '../dto';
import { TerminalEvent } from '../event-listeners';
import { BaseTerminalInterface, TerminalInterface } from '../interfaces';
import { TerminalModel } from '../models';
import { TerminalRabbitEventsProducer } from '../producers';
import { TerminalAccessConfigService } from './terminal-access-config.service';

@Injectable()
export class TerminalService {
  constructor(
    @InjectModel(TerminalSchemaName) private readonly terminalModel: Model<TerminalModel>,
    @InjectModel(BusinessSchemaName) private readonly businessModel: Model<BusinessModel>,
    private readonly channelService: ChannelService,
    @Inject(CHANNEL_SET_SERVICE) private readonly channelSetService: ChannelSetServiceInterface,
    private readonly channelEventMessagesProducer: ChannelEventMessagesProducer,
    private readonly terminalEventsProducer: TerminalRabbitEventsProducer,
    private readonly terminalAccessConfigService: TerminalAccessConfigService,
    private readonly dispatcher: EventDispatcher,
  ) { }

  public async retrieveListForAdmin(query: AdminTerminalListDto): Promise<any> {
    const limit: number = query.limit || 100;
    const page: number = query.page || 1;
    const offset: number = (page - 1) * limit;

    const conditions: any = { };

    if (query.active) {
      conditions.active = { $eq: query.active };
    }

    if (query.businessIds) {
      conditions.businessId = { $in: query.businessIds };
    }

    if (query.searchString) {
      conditions.$text = { $search: query.searchString };
    }

    const terminals: TerminalModel[] = await this.terminalModel
      .find(conditions)
      .select(query.projection)
      .sort({ createdAt: 1 })
      .skip(offset)
      .limit(limit);

    const total: number = await this.terminalModel.count();

    return {
      page,
      terminals,
      total,
    };
  }

  public async create(
    business: BusinessModel,
    createTerminalDto: CreateTerminalDto,
  ): Promise<TerminalModel> {
    const channel: ChannelModel = await this.channelService.findOneByType('pos');
    const channelSets: ChannelSetModel[] = await this.channelSetService.create(channel, business._id);

    for (const channelSet of channelSets) {
      await this.channelEventMessagesProducer.sendChannelSetNamedByApplication(
        channelSet,
        createTerminalDto.name,
      );
    }

    const activeTerminal: TerminalModel = await this.getActive(business);
    let terminal: TerminalModel;
    if (activeTerminal) {
      const terminalToClone: TerminalModel = {
        ...activeTerminal.toObject(),
        ...createTerminalDto,
      } as TerminalModel;
      terminal = await this.clone(business, terminalToClone, channelSets);
    } else {
      const createDto: BaseTerminalInterface = {
        ...createTerminalDto,
        active: this.isActiveTerminal(business),
        businessId: business._id,
        channelSets: channelSets,
      };
      terminal = await this.terminalModel.findOneAndUpdate(
        {
          businessId: business._id,
          name: createTerminalDto.name,
        },
        {
          $set: createDto,
        },
        {
          new: true,
          setDefaultsOnInsert: true,
          upsert: true,
        },
      );
    }

    business = await this.businessModel.findOneAndUpdate(
      { _id: business.id },
      { $push: { terminals: terminal } },
      { new: true },
    );

    if (terminal.active) {
      await this.setActive(business, terminal);
    }

    await this.dispatcher.dispatch(TerminalEvent.TerminalCreated, terminal);

    await this.terminalAccessConfigService.createOrUpdate(terminal, { isLive: true });

    return terminal;
  }

  public async findDefaultTerminal(business: BusinessModel): Promise<TerminalModel> {
    return this.terminalModel.findOne({ businessId: business._id, default: true });
  }

  public async removeInBusiness(
    business: BusinessModel,
    terminal: TerminalModel,
    deleteTestData: boolean = false,
  ): Promise<boolean> {
    if (business && business.terminals.length <= 1) {
      if (deleteTestData === false) {
        throw new HttpException(`Can not delete last terminal`, HttpStatus.PRECONDITION_FAILED);
      }
      await this.terminalModel.findOneAndUpdate(
        {
          _id: terminal,
        },
        {
          $set: { active: true },
        },
      );

      return false;
    }
    if (terminal.default) {
      await this.setFirstTerminalAsDefault(business);
    }
    await terminal.populate('channelSets').execPopulate();
    await this.terminalModel.remove({ _id: terminal.id });

    if (business) {
      await this.businessModel.findOneAndUpdate(
        { _id: business.id },
        { $pull: { terminals: terminal } },
      );
    }

    await this.dispatcher.dispatch(TerminalEvent.TerminalRemoved, terminal, deleteTestData);

    return true;
  }

  public async removeById(id: string): Promise<void> {
    const terminal: TerminalModel = await this.terminalModel.findByIdAndRemove({ _id: id });
    await terminal
      .populate('channelSets')
      .populate('business')
      .execPopulate()
    ;
    await this.dispatcher.dispatch(TerminalEvent.TerminalRemoved, terminal);

    if (terminal.active) {
      await this.setFirstTerminalAsDefault(terminal.business);
    }
  }

  public async findAllByBusiness(business: BusinessModel): Promise<TerminalModel[]> {
    await business.populate('terminals').execPopulate();

    return business.terminals;
  }

  public findAll(batchSize: number): Observable<any> {
    const cursor: QueryCursor<TerminalModel> = this.terminalModel
      .find({ })
      .cursor({ batchSize });

    return fromEvent(cursor, 'data')
    .pipe(
      takeUntil(
        fromEvent(cursor, 'end'),
      ),
    );
  }

  public async findOneById(terminalId: string): Promise<TerminalModel> {
    return this.terminalModel.findOne({ _id: terminalId });
  }

  public async findByBusinessIds(businessIds: string[]): Promise<TerminalModel[]> {
    return this.terminalModel.find({ businessId : { $in : businessIds } }).populate('business');
  }

  public async findInactiveByBusinessId(businessId: string): Promise<TerminalModel[]> {
    return this.terminalModel.find({ businessId : businessId, active: false }).populate('business');
  }

  public async findInactive(): Promise<TerminalModel[]> {
    return this.terminalModel.find({ active: false }).limit(10).populate('business');
  }

  public async update(
    terminal: TerminalModel,
    updateTerminalDto: UpdateTerminalDto,
  ): Promise<TerminalModel> {
    const originalTerminal: TerminalModel = await this.terminalModel.findOne({ _id: terminal.id });
    const result: TerminalModel = await this.terminalModel.findOneAndUpdate(
      { _id: terminal.id },
      { $set: updateTerminalDto },
      { new: true },
    );

    if (updateTerminalDto.name && terminal.name !== updateTerminalDto.name) {
      await terminal.populate('channelSets').execPopulate();
      await this.channelEventMessagesProducer.sendChannelSetNamedByApplication(
        terminal.channelSet,
        updateTerminalDto.name,
      );
    }

    if (updateTerminalDto.active) {
      await this.terminalEventsProducer.setDefaultTerminalEvent(
        terminal.business,
        result,
      );
    }

    await this.dispatcher.dispatch(TerminalEvent.TerminalUpdated, originalTerminal, result);

    return result;
  }

  public async isNameAvailable(
    business: BusinessModel,
    name: string,
    terminal?: TerminalModel,
  ): Promise<boolean> {
    const existingTerminal: TerminalModel = await this.terminalModel.findOne({
      businessId: business._id,
      name: name,
    });

    return !existingTerminal || (!!terminal && terminal.id === existingTerminal.id);
  }

  public async setActive(
    business: BusinessModel,
    terminalModel: TerminalModel,
  ): Promise<TerminalModel> {
    await this.terminalModel.updateMany(
      { businessId: business._id, _id: { $ne: terminalModel._id } },
      { $set: { active: false } }
    );

    await this.terminalEventsProducer.setDefaultTerminalEvent(
      business,
      terminalModel,
    );

    terminalModel.active = true;
    await terminalModel.save();

    return terminalModel;
  }

  public async getActive(business: BusinessModel): Promise<TerminalModel> {
    return this.terminalModel.findOne({ businessId: business._id, active: true });
  }

  public async getList(query: { }, limit: number, skip: number): Promise<TerminalModel[]> {
    return this.terminalModel.find(query)
      .limit(limit)
      .skip(skip)
      .populate('business')
    ;
  }

  public async findForceInstall(): Promise<TerminalModel[]> {
    return this.terminalModel.find(
      {
        forceInstall: { $ne: true },
      },
    ).sort(
      {
        createdAt: -1,
      },
    ).limit(1);
  }

  public async setForceInstall(terminal: TerminalModel): Promise<void> {
    await this.terminalModel.findOneAndUpdate(
      {
        _id: terminal._id,
      },
      {
        $set: {
          forceInstall: true,
        },
      },
    );
  }

  public async resetForceInstallById(terminalId: string): Promise<void> {
    await this.terminalModel.updateMany(
      {
        _id: terminalId,
      },
      {
        $set: {
          forceInstall: false,
        },
      },
    );
  }

  public async resetForceInstall(): Promise<void> {
    await this.terminalModel.updateMany(
      {
        active: true,
        forceInstall: true,
      },
      {
        $set: {
          forceInstall: false,
        },
      },
    );
  }

  public async createChannelSetForBusiness(
    business: BusinessModel,
    type: ChannelSubTypeEnum,
  ): Promise<ChannelSetModel> {
    const channel: ChannelModel = await this.channelService.findOneByType('pos');
    const channelSets: ChannelSetModel[] =
      await this.channelSetService.findAllByChannelAndBusiness(channel, business._id);

    let channelSet: ChannelSetModel = channelSets.find((item: ChannelSetModel) => item.type === type);
    if (channelSet) {
      return channelSet;
    }

    channelSet = await this.channelSetService.createChannelSetWithType(channel, business._id, type);
    const terminals: TerminalModel[] = await this.findAllByBusiness(business);
    for (const terminal of terminals) {
      await this.channelEventMessagesProducer.sendChannelSetNamedByApplication(
        channelSet,
        terminal.name,
      );

      await this.terminalModel.findOneAndUpdate(
        { _id: terminal._id},
        { $push: { channelSets: channelSet}},
      );
    }

    return channelSet;
  }

  public async deleteChannelSetFromBusiness(
    business: BusinessModel,
    type: ChannelSubTypeEnum,
  ): Promise<void> {
    const channel: ChannelModel = await this.channelService.findOneByType('pos');
    const channelSets: ChannelSetModel[] =
      await this.channelSetService.findAllByChannelAndBusiness(channel, business._id);

    const channelSet: ChannelSetModel = channelSets.find((item: ChannelSetModel) => item.type === type);
    if (!channelSet) {
      return;
    }

    const terminals: TerminalModel[] = await this.findAllByBusiness(business);

    for (const terminal of terminals) {
      await this.terminalModel.findOneAndUpdate(
        { _id: terminal._id},
        { $pull: { channelSets: channelSet}},
      );
    }

    await this.businessModel.findOneAndUpdate(
      { _id: business._id},
      { $pull: { channelSets: channelSet}},
    );

    await this.channelSetService.deleteOneById(channelSet._id);
  }

  private async setFirstTerminalAsDefault(business: BusinessModel): Promise<void> {
    if (!business) {
      return;
    }

    await business.populate('terminals').execPopulate();
    const firstTerminal: TerminalModel = business.terminals.shift();
    if (!firstTerminal) {
      return;
    }

    firstTerminal.default = true;
    await firstTerminal.save();

    await this.terminalEventsProducer.setDefaultTerminalEvent(
      business,
      firstTerminal,
    );
  }

  private async clone(
    business: BusinessModel,
    terminalToClone: TerminalModel,
    channelSets: ChannelSetModel[],
  ): Promise<TerminalModel> {
    const createDto: TerminalInterface & { _id: string } = {
      ...terminalToClone,
      _id: uuid(),
      active: false,
      businessId: business._id,
      channelSets: channelSets,
    };

    return this.terminalModel.create(createDto as TerminalModel);
  }

  private isActiveTerminal(business: BusinessModel): boolean {
    return !business || !business.terminals || business.terminals.length === 0;
  }
}
