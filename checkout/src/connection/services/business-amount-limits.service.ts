import { Injectable } from '@nestjs/common';
import { ConnectionModel } from '../models';
import { BusinessAmountLimitsDto } from '../dto';
import { ConnectionService } from './connection.service';

@Injectable()
export class BusinessAmountLimitsService {
  constructor(
    private readonly connectionService: ConnectionService,
  ) { }

  public async getBusinessLimits(
    businessId: string,
    paymentMethod: string,
    issuer?: string,
  ): Promise<BusinessAmountLimitsDto> {
    const businessConnections: ConnectionModel[] = await this.connectionService.findAllByBusinessId(businessId);
    const paymentMethodConnections: ConnectionModel[] = businessConnections.filter(
      (connection: ConnectionModel) => connection.integration.name === paymentMethod &&
        connection.integration.issuer === issuer,
    );

    for (const connection of paymentMethodConnections) {
      if (connection.options?.minAmount && connection.options?.maxAmount) {
        return {
          businessId,
          paymentMethod,

          max: connection.options.maxAmount,
          min: connection.options.minAmount,
        };
      }
    }

    return null;
  }

}
