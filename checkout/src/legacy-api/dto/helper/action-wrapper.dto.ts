import { HeadersHolderDto } from './headers-holder.dto';

export class ActionWrapperDto extends HeadersHolderDto {
  public action: string;
  public payloadDto: object;
}
