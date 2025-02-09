import { Body, Controller, NotFoundException, Post } from '@nestjs/common';
import { ParamModel } from '@pe/nest-kit';
import { ConnectionModel, ConnectionSchemaName } from '@pe/third-party-sdk';

import { OuterStockChangedDto, OuterStockDto } from '../dto';
import { MessageBusEventsEnum } from '../enum';
import { EventProducer } from '../producer';

@Controller('inventory/:authorizationId')
export class InventoryController {
  constructor(
    private readonly eventProducer: EventProducer,
  ) { }

  @Post()
  public async outerStockCreated(
    @ParamModel({ authorizationId: ':authorizationId' }, ConnectionSchemaName) connection: ConnectionModel,
    @Body() dto: OuterStockDto,
  ): Promise<void> {
    await connection
      .populate('business')
      .populate('integration')
      .execPopulate()
    ;

    if (!connection.business) {
      throw new NotFoundException(`Business for authorization "${connection.authorizationId}" not found`);
    }

    return this.eventProducer.sendOuterStockCreated(
      connection.business,
      connection.integration,
      dto,
    );
  }

  @Post('add')
  public async outerStockAdd(
    @ParamModel({ authorizationId: ':authorizationId' }, ConnectionSchemaName) connection: ConnectionModel,
    @Body() dto: OuterStockChangedDto,
  ): Promise<void> {
    await connection
      .populate('business')
      .populate('integration')
      .execPopulate()
    ;

    if (!connection.business) {
      throw new NotFoundException(`Business for authorization "${connection.authorizationId}" not found`);
    }

    return this.eventProducer.sendOuterStockAdded(
      connection.business,
      connection.integration,
      dto,
    );
  }

  @Post('subtract')
  public async outerInventorySubtract(
    @ParamModel({ authorizationId: ':authorizationId' }, ConnectionSchemaName) connection: ConnectionModel,
    @Body() dto: OuterStockChangedDto,
  ): Promise<void> {
    await connection
      .populate('business')
      .populate('integration')
      .execPopulate()
    ;

    if (!connection.business) {
      throw new NotFoundException(`Business for authorization "${connection.authorizationId}" not found`);
    }

    return this.eventProducer.sendOuterStockSubtracted(
      connection.business,
      connection.integration,
      dto,
    );
  }

  @Post('synchronization/trigger')
  public async outerInventoryTrigger(
    @ParamModel({ authorizationId: ':authorizationId' }, ConnectionSchemaName) connection: ConnectionModel,
  ): Promise<void> {
    await connection
      .populate('business')
      .populate('integration')
      .execPopulate()
    ;

    if (!connection.business) {
      throw new NotFoundException(`Business for authorization "${connection.authorizationId}" not found`);
    }

    return this.eventProducer.sendOuterStockSynchronizationEvent(
      MessageBusEventsEnum.StockEventTrigger,
      connection.business,
      connection.integration,
    );
  }
}
