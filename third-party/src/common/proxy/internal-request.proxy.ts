import { HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import { FastifyReply, FastifyRequest } from 'fastify';
import { IncomingHttpHeaders } from 'http';

@Injectable()
export class InternalRequestProxy {
  constructor(private readonly httpService: HttpService) { }

  public async proxyRequest(url: string, request: FastifyRequest, response: FastifyReply<any>): Promise<void> {
    const headers: any = request.headers;
    const body: any = request.body;
    const method: Method = request.method as Method;
    try {
      const externalResponse: AxiosResponse<any> = await this.sendRequest({
        data: body,
        headers: this.filterRequestHeaders(headers),
        method,
        url,
      });
      response.status(externalResponse.status)
        .send(externalResponse.data);
    } catch (error) {
      this.proxyErrorResponse(error, response);
    }
  }

  private async sendRequest(config: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.httpService
      .request(config)
      .toPromise();
  }

  private proxyErrorResponse(error: any, response: FastifyReply<any>): void {
    if (!error.response) {
      throw error;
    }
    response
      .status(error.response.status || HttpStatus.INTERNAL_SERVER_ERROR)
      .send(error.response.data || []);
  }

  private filterRequestHeaders(headers: IncomingHttpHeaders): IncomingHttpHeaders {
    return {
      authorization: headers.authorization || '',
    };
  }
}
