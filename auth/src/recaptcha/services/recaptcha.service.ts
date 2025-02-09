import { HttpService, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { BlockListModel } from '../../brute-force/models/block-list.model';
import { BlockListSchemaName } from '../../brute-force/schemas/block-list.schema';
import { environment } from '../../environments';
import * as querystring from 'querystring';

@Injectable()
export class Recaptcha {
  private readonly googleUrl: string = 'https://www.google.com/recaptcha/api/siteverify';

  constructor(
    @InjectModel(BlockListSchemaName) private readonly blockListModel: BlockListModel,
    private readonly httpService: HttpService,
  ) { }

  public async shouldVerify(userId: string, ipAddress: string): Promise<boolean> {
    return await this.blockListModel.getActiveBanCount(userId, ipAddress) === 1;
  }

  public async verify(token: string): Promise<boolean> {
    const formParams: { } = {
      response: token,
      secret: environment.recaptchaSecret,
    };

    const axiosRequestConfig: AxiosRequestConfig = {
      data: querystring.stringify(formParams),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
      url: this.googleUrl,
    };

    const response: AxiosResponse<any> = await this.httpService.request(axiosRequestConfig).toPromise();

    return response.data.success;
  }
}
