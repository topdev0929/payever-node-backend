import * as crypto from 'crypto';
import { HttpService, Inject, Injectable } from '@nestjs/common';
import { catchError, map } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { MailchimpConfigInterface, MailchimpContactInterface } from '../interfaces';

@Injectable()
export class MailchimpClientService {
  constructor(
    private readonly httpService: HttpService,
    @Inject('MailchimpConfigInterface') private readonly config: MailchimpConfigInterface,
  ) { }

  public async doesContactExist(email: string): Promise<boolean> {
    return this.httpService.get(
        `${this.config.baseUrl}/lists/${this.config.audienceId}/members/${this.getEmailId(email)}`,
        this.getRequestConfig(),
      )
      .pipe(
        map(() => true),
        catchError(() => of(false)),
      )
      .toPromise();
  }

  public async createContact(contact: MailchimpContactInterface): Promise<MailchimpContactInterface> {
    return this.httpService.post(
        `${this.config.baseUrl}/lists/${this.config.audienceId}/members/`,
        contact,
        this.getRequestConfig(),
      )
      .pipe(
        map((res: AxiosResponse) => res.data),
        catchError((error: AxiosError) => {
          return throwError(
            `Couldn't create Mail Chimp contact:`
            + `${error.message} ${error.response ? JSON.stringify(error.response.data) : ''}`,
          );
        }),
      )
      .toPromise();
  }

  private getEmailId(email: string): string {
    return crypto.createHash('md5').update(email.toLowerCase()).digest('hex');
  }

  private getRequestConfig(): AxiosRequestConfig {
    return {
      auth: {
        password: this.config.apiKey,
        username: 'dummy',
      },
    };
  }
}
