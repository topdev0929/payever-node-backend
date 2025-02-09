import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ProductService } from '../services';
import { RabbitEventNameEnum } from '../../environments/rabbitmq';
import { ProductExportRequestDto } from '../dto';
import { MessageBusChannelsEnum } from '../../shared';

@Controller()
export class ExportMessageBusController {
  constructor(private readonly productService: ProductService) { }

  @MessagePattern({
    channel: MessageBusChannelsEnum.products,
    name: RabbitEventNameEnum.ProductsEventProductRequestExport,
  })
  public async planSubscribed(payloadDto: ProductExportRequestDto): Promise<void> {
    await this.productService.export(payloadDto.productId);
  }
}
