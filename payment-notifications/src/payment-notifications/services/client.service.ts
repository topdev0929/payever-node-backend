import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClientModel } from '../models';
import { ClientSchemaName } from '../schemas';
import { classToPlain } from 'class-transformer';
import { ClientDto } from '../dto';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(ClientSchemaName)
    private readonly clientModel: Model<ClientModel>,
  ) { }

  public async create(clientDto: ClientDto): Promise<ClientModel> {
    const plainClient: any = classToPlain(clientDto);
    plainClient._id = clientDto.id;

    return this.clientModel.create(plainClient);
  }

  public async findByClientId(id: string): Promise<ClientModel> {
    return this.clientModel.findOne({
      _id: id,
    });
  }
}
