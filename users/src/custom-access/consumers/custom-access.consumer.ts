import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CustomAccessService } from '../services';
import { MessageBusChannelsEnum } from '../../user/enums';
import { CustomAccessDeletedDto, CustomAccessExportDto, CustomAccessMessageDto } from '../dtos';
import { BuilderCustomAccessMessageEnum } from '../enums';

@Controller()
export class CustomAccessConsumer {
  constructor(
    private readonly customAccessService: CustomAccessService,
  ) { }

  @MessagePattern({
    channel: MessageBusChannelsEnum.users,
    name: BuilderCustomAccessMessageEnum.exported,
  })
  public async export(dto: CustomAccessExportDto): Promise<void> {
    await this.customAccessService.export(dto);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.users,
    name: BuilderCustomAccessMessageEnum.created,
  })
  public async created(dto: CustomAccessMessageDto): Promise<void> {
    await this.customAccessService.upsert(dto.customAccess);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.users,
    name: BuilderCustomAccessMessageEnum.updated,
  })
  public async updated(dto: CustomAccessMessageDto): Promise<void> {
    await this.customAccessService.upsert(dto.customAccess);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.users,
    name: BuilderCustomAccessMessageEnum.deleted,
  })
  public async deleted(dto: CustomAccessDeletedDto): Promise<void> {
    await this.customAccessService.deleted(dto.customAccessId);
  }
}
