import { Injectable, Logger } from '@nestjs/common';
import { IntercomService } from '@pe/nest-kit';
import { environment } from '../../environments';
import { ClientSecretResponseDto } from '../dto';
import { plainToClass } from 'class-transformer';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AxiosError, AxiosResponse } from 'axios';
import { ClientService } from './client.service';
import { ClientInterface } from '../interfaces';

@Injectable()
export class OAuthService {
  constructor(
    private readonly httpIntercomService: IntercomService,
    private readonly clientService: ClientService,
    private readonly logger: Logger,
  ) { }

  public async getOAuthClientSecret(clientId: string, businessId: string): Promise<ClientSecretResponseDto> {
    const clientModel: ClientInterface = await this.clientService.findByClientId(clientId);

    if (clientModel) {
      return {
        secret: clientModel.secret,
      };
    }

    const url: string = `${environment.authMicroUrl}/oauth/${businessId}/clients/${clientId}`;
    const request: Observable<AxiosResponse<any>> = await this.httpIntercomService.get(url);

    const clientSecretResponseDto: ClientSecretResponseDto = await request.pipe(
      map((response: any) => {
        this.logger.log({
          message: 'Received client secret from auth micro',
          response: response.data,
          url: url,
        });

        return plainToClass(ClientSecretResponseDto, response.data);
      }),
      catchError((error: AxiosError) => {
        this.logger.warn({
          error: error.response?.data ? error.response.data : error.message,
          message: 'Failed response from auth micro',
          url: url,
        });

        return of({
          secret: null,
        });
      }),
    ).toPromise();

    if (clientSecretResponseDto.secret) {
      await this.clientService.create({
        id: clientId,
        secret: clientSecretResponseDto.secret,
      });
    }

    return clientSecretResponseDto;
  }
}
