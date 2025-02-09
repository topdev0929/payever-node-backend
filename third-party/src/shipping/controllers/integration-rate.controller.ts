import { Controller, Get, HttpException, HttpService, Logger, NotFoundException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ParamModel } from '@pe/nest-kit';
import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';
import { NestKitLogFactory } from '@pe/nest-kit/modules/logging';
import { ConnectionModel, ConnectionService, IntegrationModel, IntegrationSchemaName } from '@pe/third-party-sdk';
import { AxiosError, AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BusinessModel } from '../../business/models';
import { BusinessSchemaName } from '../../common/mongoose-schema.names';
import { getServiceUrl } from '../../environments';

const BUSINESS_ID_PLACEHOLDER: string = ':businessId';
const INTEGRATION_NAME_PLACEHOLDER: string = ':integrationName';

@Controller('business/:businessId/shipping/:integrationName/rates')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Roles(RolesEnum.anonymous)
@ApiTags('shipping')
export class IntegrationRateController {
  constructor(
    private readonly connectionService: ConnectionService,
    private readonly http: HttpService,
    private readonly logger: Logger,
  ) { }

  @Get()
  public async getRates(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @ParamModel({ name: INTEGRATION_NAME_PLACEHOLDER}, IntegrationSchemaName) integration: IntegrationModel,
  ): Promise<any> {
    const connection: ConnectionModel =
      await this.connectionService.findFirstByBusinessAndIntegration(business, integration);
    if (!connection) {
      throw new NotFoundException(`Business ${business.id} doesn't have ${integration.name} connected.`);
    }

    const url: string = `${getServiceUrl(integration.url)}/action/get-rates/${connection.authorizationId}`;
    const response: Observable<AxiosResponse<any>> = this.http.get<any>(url);

    return response.pipe(
      map((res: any) => {
        return res.data;
      }),
      catchError((err: AxiosError) => {
        this.logger.error(NestKitLogFactory.getLogFromAxiosError(err));
        throw new HttpException(err.response.data, err.response.status);
      }),
    );
  }
}
