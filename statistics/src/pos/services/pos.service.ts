import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateTerminalDto } from '../dto';
import { TerminalSchemaName } from '../schemas/terminal.schema';
import { TerminalModel } from '../interfaces/entities/terminal.model';
import { SetDefaultTerminalDto } from '../dto/set-default-terminal.dto';
import { DomainUpdateDto } from '../dto/domain-update.dto';

@Injectable()
export class PosService {
  constructor(
    @InjectModel(TerminalSchemaName) private readonly terminalModel: Model<TerminalModel>,
    private readonly logger: Logger,
  ) { }

  public async create(
    dto: CreateTerminalDto,
  ): Promise<TerminalModel> {
    return  this.upsert(dto);
  }

  public async removeById(shopId: string): Promise<TerminalModel> {
    return this.terminalModel.findOneAndDelete({ _id: shopId });
  }

  public async upsert(dto: CreateTerminalDto): Promise<TerminalModel> {
    return this.terminalModel.findOneAndUpdate(
      { _id: dto.id },
      {
        $set: {
          business: dto.business.id as any,
          ...dto.domain && {
            domain: dto.domain,
          },
          isDefault: dto.active,
        },
      },
      {
        new: true,
        setDefaultsOnInsert: true,
        upsert: true,
      },
    );
  }

  public async updateDomain(dto: DomainUpdateDto): Promise<TerminalModel> {
    return this.terminalModel.findOneAndUpdate(
      { _id: dto.id },
      {
        $set: {
          domain: dto.newDomain,
        },
      },
      {
        new: true,
        setDefaultsOnInsert: true,
        upsert: true,
      },
    );
  }

  public async getDefaultTerminalByBusiness(business: string): Promise<TerminalModel> {
    return this.terminalModel.findOne({
      business,
      isDefault: true,
    });
  }

  public async setDefaultTerminal(dto: SetDefaultTerminalDto): Promise<TerminalModel> {
    const defTerminal: TerminalModel = await this.getDefaultTerminalByBusiness(dto.businessId);
    if (!defTerminal) {
      this.logger.warn({
        context: `PosService.setDefaultTerminal`,
        message: `Default terminal does not exist`,

        dto,
      });

      return;
    }

    defTerminal.isDefault = false;
    await defTerminal.save();

    return this.terminalModel.findOneAndUpdate(
      {
        _id: dto.terminalId,
      },
      {
        $set: {
          isDefault: true,
        },
      },
    );
  }
}
