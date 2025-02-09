export class TerminalEventPayloadDto {
  public id: string;
  public name: string;
  public logo: string;
  public active: boolean;
  public default: boolean;
  public domain: string;
  public appType: string;
  public business: {
    id: string;
  };
  public channelSet: {
    id: string;
  };
}
