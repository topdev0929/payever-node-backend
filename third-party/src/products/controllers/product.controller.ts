import { Body, Controller, Delete, Patch, Post, Put } from '@nestjs/common';
import { ParamModel } from '@pe/nest-kit';
import { ConnectionModel } from '@pe/third-party-sdk/module/models';
import { ConnectionSchemaName } from '@pe/third-party-sdk/module/mongoose';
import { ProductDto, ProductRemovedDto } from '../dto';
import { EventProducer } from '../producer';

@Controller('product/:authorizationId')
export class ProductController {
  constructor(
    private readonly eventProducer: EventProducer,
  ) { }

  @Post()
  public async outerProductCreate(
    @ParamModel(
      { authorizationId: ':authorizationId' },
      ConnectionSchemaName,
    ) connection: ConnectionModel,
    @Body() dto: ProductDto,
  ): Promise<void> {
    await connection
      .populate('business')
      .populate('integration')
      .execPopulate()
    ;

    return this.eventProducer.sendOuterProductCreated(
      connection.business,
      connection.integration,
      dto,
    );
  }

  @Patch()
  public async outerProductUpdate(
    @ParamModel(
      { authorizationId: ':authorizationId' },
      ConnectionSchemaName,
    ) connection: ConnectionModel,
    @Body() dto: ProductDto,
  ): Promise<void> {
    await connection
      .populate('business')
      .populate('integration')
      .execPopulate()
    ;

    return this.eventProducer.sendOuterProductUpdated(
      connection.business,
      connection.integration,
      dto,
    );
  }

  @Put()
  public async outerProductUpsert(
    @ParamModel(
      { authorizationId: ':authorizationId' },
      ConnectionSchemaName,
    ) connection: ConnectionModel,
    @Body() dto: ProductDto,
  ): Promise<void> {
    await connection
      .populate('business')
      .populate('integration')
      .execPopulate()
    ;

    return this.eventProducer.sendOuterProductUpserted(
      connection.business,
      connection.integration,
      dto,
    );
  }

  @Delete()
  public async outerProductRemove(
    @ParamModel(
      { authorizationId: ':authorizationId' },
      ConnectionSchemaName,
    ) connection: ConnectionModel,
    @Body() dto: ProductRemovedDto,
  ): Promise<void> {
    await connection
      .populate('business')
      .populate('integration')
      .execPopulate()
    ;

    return this.eventProducer.sendOuterProductRemoved(
      connection.business,
      connection.integration,
      dto,
    );
  }
}
