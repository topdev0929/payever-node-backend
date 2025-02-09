import {
  TPMContactRMQIncomingDto,
  TPMTextMessageRMQIncomingDto,
  TPMCustomerChatRMQIncomingDto,
} from './tpm-messages.dto';

export class FirstMessageDto {
  public contact?: TPMContactRMQIncomingDto;
  public chat?: TPMCustomerChatRMQIncomingDto;
  public message: TPMTextMessageRMQIncomingDto;
}
