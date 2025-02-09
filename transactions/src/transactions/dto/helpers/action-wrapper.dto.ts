import { AccessTokenPayload } from '@pe/nest-kit';
import { HistoryApiCallStatusEnum } from '../../enum';

export class ActionWrapperDto {
  public action?: string;
  public actionUrl?: string;
  public payloadDto: any;
  public idempotencyKey?: string;
  public forceRetryKey?: string;
  public user?: AccessTokenPayload;
  public status?: HistoryApiCallStatusEnum;
  public executionStartTime?: [number, number];
  public executionEndTime?: [number, number];
  public executionTime?: string;
  public isExternalApiCall?: boolean;
  public error?: string;
}
