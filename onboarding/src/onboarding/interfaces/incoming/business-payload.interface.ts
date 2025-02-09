import { BusinessCreateBusinessPayloadInterface } from '../outgoing/business-create-payload.interface';

export interface BusinessPayloadInterface extends Omit<BusinessCreateBusinessPayloadInterface, 'id'> {
}
