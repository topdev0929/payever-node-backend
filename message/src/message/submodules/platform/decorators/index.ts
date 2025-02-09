import { SetMetadata, CustomDecorator } from '@nestjs/common';

export const MESSAGING_TYPE_SERVICE_TAG: string = 'messaging:type:service';

export const MessagingTypeService: () => CustomDecorator = () => SetMetadata(MESSAGING_TYPE_SERVICE_TAG, true);

export const MESSAGING_PRODUCER_TAG: string = 'messaging:producer';

export const MessagingProducer: () => CustomDecorator = () => SetMetadata(MESSAGING_PRODUCER_TAG, true);
