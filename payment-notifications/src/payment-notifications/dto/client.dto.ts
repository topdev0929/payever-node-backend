import { ClientInterface } from '../interfaces';

export class ClientDto implements ClientInterface {
  public id: string;
  public secret: string;
}
