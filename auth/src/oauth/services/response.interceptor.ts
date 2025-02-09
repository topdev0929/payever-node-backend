import { CallHandler, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Document } from 'mongoose';
import { map } from 'rxjs/operators';

import { OAuthClient } from '../interfaces';

interface OAuthClientResponse extends OAuthClient {
  businessId: string;
}

@Injectable()
export class ResponseInterceptor {
  public intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(async (oauthClients: OAuthClientResponse & Document | Array<OAuthClientResponse & Document> | null) => {
        if (!oauthClients) {
          return oauthClients;
        }
        
        const http: any = context.switchToHttp();
        const request: any = http.getRequest();
        const params: any = request.params;

        if (Array.isArray(oauthClients)) {
          const result: OAuthClientResponse[] = [];
          for (const oauthClient of oauthClients) {
            result.push(ResponseInterceptor.formatResponse(oauthClient, params.businessId));
          }

          return result;
        }

        return ResponseInterceptor.formatResponse(oauthClients, params.businessId);
      }),
    );
  }

  private static formatResponse(oauthClient: OAuthClientResponse & Document, businessId: string)
  : OAuthClientResponse {
    const response: OAuthClientResponse = oauthClient.toObject() as never;

    response.businessId = response.businesses?.length ? response.businesses[0] : businessId;
    response.businesses && delete response.businesses;

    return response;
  }
}
