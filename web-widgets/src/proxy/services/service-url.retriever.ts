import { Global, Injectable } from '@nestjs/common';
import { IntegrationModel, InnerActionModel } from '../models';

@Global()
@Injectable()
export class ServiceUrlRetriever {
  constructor(
    private readonly env: NodeJS.ProcessEnv,
  ) { }

  public getServiceUrl(identifier: string): string {
    const regex: RegExp = /\${(\w+)}/g;
    let url: string = identifier;
    let matches: string[] = regex.exec(url);

    while (matches) {
      url = url.replace(`\${${matches[1]}}`, this.env[matches[1]]);
      matches = regex.exec(url);
    }

    return url;
  }

  public composeActionUrl(
    businessId: string,
    integration: IntegrationModel,
    action: InnerActionModel,
    data: { } = { },
  ): string {
    /* if integration.url is empty then action must hold absolute URL */
    const baseUrl: string = integration.url || '';
    let actionUrl: string = action.url;

    actionUrl = actionUrl.replace(':businessId', businessId);
    if (data) {
      for (const param of Object.keys(data)) {
        if (typeof data[param] === 'string') {
          actionUrl = actionUrl.replace(':' + param, data[param]);
        }
      }
    }

    return this.getServiceUrl(`${baseUrl}${actionUrl}`);
  }
}
