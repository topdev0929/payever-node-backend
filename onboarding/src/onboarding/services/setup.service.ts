import { HttpService, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';

import { ObjectMerger } from '../helpers/object.merger';
import { TaskOptionsInterface } from '../interfaces';
import { AuthRegisterPayloadInterface } from '../interfaces/outgoing';
import { TemplateModel } from '../models';
import { environment } from '../../environments';
import { SetupMessageDto, TokenResultDto } from '../dto';
import { TemplateService } from './template.service';
import { TaskService } from './task.service';
import { ScopesEnum } from '../enums';

@Injectable()
export class SetupService {
  constructor(
    private readonly httpService: HttpService,
    private readonly templateService: TemplateService,
    private readonly taskService: TaskService,
  ) { }

  public async setup(
    setupDto: SetupMessageDto,
    tokenData: TaskOptionsInterface,
    bulkImportId: string,
  ): Promise<void> {
    if (setupDto.template) {
      const template: TemplateModel = await this.templateService.findByName(setupDto.template);
      setupDto = ObjectMerger.merge(template.config, setupDto);

      delete setupDto.template;
    }

    await this.taskService.createTask(setupDto, tokenData, bulkImportId);
  }

  public async getOrganizationToken(clientId: string, clientSecret: string): Promise<string> {
    const organizationTokenResponse: AxiosResponse<TokenResultDto> = await this.httpService.post<TokenResultDto>(
      `${environment.microservices.authUrl}/api/organizations/token`,
      { 
        clientId,
        clientSecret,
        scopes: Object.values(ScopesEnum),
      },
    ).toPromise();
    
    return organizationTokenResponse.data.accessToken;
  }

  /**
   * @unused
   */
  public async authRegisterUser(
    authDto: AuthRegisterPayloadInterface,
    bulkEventId?: string,
  ): Promise<TokenResultDto> {
    const request: Observable<AxiosResponse<TokenResultDto>> = this.httpService.post<any>(
      `${environment.microservices.authUrl}/api/register`,
      {
        email: authDto.email,
        password: authDto.password,

        first_name: authDto.first_name,
        last_name: authDto.last_name,

        forceGeneratePassword: !!authDto.forceGeneratePassword || !authDto.password,
      } as AuthRegisterPayloadInterface,
      {
        headers: {
          'X-Bulk-Event-Id': bulkEventId,
        },
      },
    );
    const response: AxiosResponse<TokenResultDto> = await request.toPromise();

    return response.data;
  }
}
