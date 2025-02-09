import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConnectionSchemaName } from '../../mongoose-schema';
import { ConnectionModel } from '../models';

/**
 * @deprecated This service is only for compatibility with Checkout PHP.
 * Do not use it anywhere. Also do not use flag "isBpoActive".
 */
@Injectable()
export class BpoActiveService {
  constructor(
    @InjectModel(ConnectionSchemaName) private readonly connectionModel: Model<ConnectionModel>,
  ) { }

  public async setActive(connection: ConnectionModel): Promise<void> {
    await this.connectionModel.updateOne(
      {
        _id: connection.id,
      },
      {
        $unset: {
          isBpoActive: '',
        },
      },
    );
  }

  public async setInactive(connection: ConnectionModel): Promise<void> {
    await this.connectionModel.updateOne(
      {
        _id: connection.id,
      },
      {
        isBpoActive: false,
      },
    );
  }
}
