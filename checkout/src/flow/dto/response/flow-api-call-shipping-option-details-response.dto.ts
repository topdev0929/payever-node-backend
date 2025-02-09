import {
  FlowApiCallShippingOptionPickupLocationResponseDto,
} from './flow-api-call-shipping-option-pickup-location-response.dto';

export class FlowApiCallShippingOptionDetailsResponseDto {
  public timeslot?: Date;
  public pickupLocation?: FlowApiCallShippingOptionPickupLocationResponseDto;
}
