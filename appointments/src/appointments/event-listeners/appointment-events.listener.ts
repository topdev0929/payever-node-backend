import { Injectable } from '@nestjs/common';
import { EventDispatcher, EventListener } from '@pe/nest-kit';
import { FoldersEventsEnum } from '@pe/folders-plugin';
import { AppointmentDocument, AppointmentFieldDocument } from '../schemas';
import { AppointmentInternalEventsEnum, AppointmentRabbitEventsEnum } from '../enums';
import { appointmentToESDocument, appointmentToRmqTransformer } from '../transformers';
import { AppointmentEventsProducer } from '../producers';
import { ElasticExtraData } from '../interfaces';

@Injectable()
export class AppointmentEventsListener {
  constructor(
    protected readonly eventDispatcher: EventDispatcher,
    protected readonly appointmentEventsProducer: AppointmentEventsProducer,
  ) { }

  @EventListener(AppointmentInternalEventsEnum.AppointmentAndFieldsCreated)
  public async onAppointmentCreated(
    appointmentDocument: AppointmentDocument,
    appointmentFieldDocument: AppointmentFieldDocument,
    extraData?: ElasticExtraData,
  ): Promise<void> {
    await this.eventDispatcher.dispatch(
      FoldersEventsEnum.FolderActionCreateDocument,
      {
        ...await appointmentToESDocument(appointmentDocument),
        elasticIds: extraData?.elasticIds,
        parentFolderId: extraData?.targetFolderId,
      },
    );

    await this.appointmentEventsProducer.produceAppointmentEvent(
      AppointmentRabbitEventsEnum.created,
      appointmentToRmqTransformer(appointmentDocument),
    );
  }

  @EventListener(AppointmentInternalEventsEnum.AppointmentAndFieldsUpdated)
  public async onAppointmentUpdated(
    appointmentDocument: AppointmentDocument,
    appointmentFieldDocument: AppointmentFieldDocument,
  ): Promise<void> {
    await this.eventDispatcher.dispatch(
      FoldersEventsEnum.FolderActionUpdateDocument,
      await appointmentToESDocument(appointmentDocument),
    );

    await this.appointmentEventsProducer.produceAppointmentEvent(
      AppointmentRabbitEventsEnum.updated,
      appointmentToRmqTransformer(appointmentDocument),
    );
  }

  @EventListener(AppointmentInternalEventsEnum.AppointmentAndFieldsDeleted)
  public async onAppointmentDeleted(
    appointmentDocument: AppointmentDocument,
    appointmentFieldDocument: AppointmentFieldDocument,
  ): Promise<void> {
    await this.eventDispatcher.dispatch(
      FoldersEventsEnum.FolderActionDeleteDocument,
      appointmentDocument._id,
    );

    await this.appointmentEventsProducer.produceAppointmentEvent(
      AppointmentRabbitEventsEnum.removed,
      { id: appointmentDocument._id },
    );
  }
}
