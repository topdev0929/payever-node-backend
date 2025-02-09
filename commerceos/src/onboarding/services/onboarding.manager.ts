import { BadRequestException, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IntercomService } from '@pe/nest-kit';
import { AxiosResponse } from 'axios';
import { Model } from 'mongoose';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments';
import { IntegrationConnectionResponseDto, OnboardingDto, OnboardingRequestDto, ActionDto } from '../dto';
import { UpdateOnboardingDto } from '../dto/update-unboarding.dto';
import { OnboardingModel } from '../models';
import { OnboardingSchemaName } from '../schemas';
import { CacheManager } from './';
import {
  OnboardingPaymentNameEnum,
  OnboardingPaymentMethodEnum,
  OnboardingPaymentCountryEnum,
  OnboardingPaymentDeviceEnum,
} from '../enums';
import { PaymentFixtures } from '../../../fixtures/payments-default-apps-fixture';
import { DEFAULT_ONBOARDING_NAME } from '../constants';
import { OriginAppService } from '../../services/origin-app.service';
import { ActionAppInterface } from '../interfaces/action-app.interface';

@Injectable()
export class OnboardingManager {
  constructor(
    @InjectModel(OnboardingSchemaName)
    private readonly onboardingModel: Model<OnboardingModel>,
    private readonly cacheManager: CacheManager,
    private readonly httpService: IntercomService,
    private readonly originAppService: OriginAppService,
    private readonly logger: Logger,
  ) { }

  public async getPartner(onboardingRequest: OnboardingRequestDto): Promise<OnboardingDto> {
    const onboardingName: string = this.getCustomOnboardingName(onboardingRequest);

    let onboarding: OnboardingDto = await this.getOnboardingByName(onboardingName);
    if (!onboarding) {
      onboarding = await this.getOnboardingByName(onboardingRequest.name);
    }

    onboarding = this.replaceOnboardingName(onboarding, onboardingRequest);
    const onboardingNames: string[] = Object.values(OnboardingPaymentNameEnum);

    if (onboarding && onboarding.afterRegistration) {
      if (onboardingNames.includes(onboardingName)) {
        onboarding.afterRegistration = this.filterIntegrations(onboarding, onboardingRequest);
      }

      onboarding.afterRegistration = await this.filterAppsByOrigin(onboarding.afterRegistration, onboarding.name);
    }

    return onboarding;
  }

  private async getOnboardingByName(name: string): Promise<OnboardingDto> {
    const cacheKey: string = `onboarding-name-${name}`;
    const cachedData: string = await this.cacheManager.getData(cacheKey);
    if (cachedData) {
      try {

        return JSON.parse(cachedData);
      } catch (error) {
        this.logger.warn(`Could not read data from cache. ${error.message}`);
      }
    }

    const partner: OnboardingDto = await this.onboardingModel.findOne({ name });
    try {
      if (partner) {
        await this.cacheManager.setData(
          cacheKey,
          JSON.stringify(partner),
          environment.partnerCacheCalculationsTTL,
        );
      }
    } catch (error) {
      this.logger.warn(`Could not write data to cache. ${error.message}`);
    }

    return partner;
  }

  public async getAll(): Promise<OnboardingModel[]> {
    return this.onboardingModel.find();
  }

  public async create(onboardingDto: OnboardingDto): Promise<OnboardingModel> {
    const onboardingCount: any = await this.onboardingModel.countDocuments({ name: onboardingDto.name });

    if (onboardingCount > 0) {
      throw new BadRequestException('`name` should be unique.');
    }

    return this.onboardingModel.create(onboardingDto as OnboardingModel);
  }

  public async update(name: string, updateOnboardingDto: UpdateOnboardingDto): Promise<OnboardingModel> {
    return this.onboardingModel.findOneAndUpdate(
      { name },
      {
        $set: {
          ...updateOnboardingDto,
        },
      },
      { new: true },
    );
  }

  public async delete(onboarding: OnboardingModel): Promise<OnboardingModel> {
    return onboarding.delete();
  }

  public async getDefaultPartner(onboardingRequest: OnboardingRequestDto): Promise<OnboardingDto> {
    const onboarding: OnboardingDto = await this.onboardingModel.findOne({ name: DEFAULT_ONBOARDING_NAME });

    return this.replaceOnboardingName(onboarding, onboardingRequest);
  }

  public async getCachedOnboarding(onboardingRequest: OnboardingRequestDto): Promise<OnboardingDto> {
    let partner: OnboardingDto;
    const cacheKey: string = this.prepareCacheKey(onboardingRequest);
    const cachedData: string = await this.cacheManager.getData(cacheKey);
    if (cachedData) {

      return JSON.parse(cachedData);
    }

    partner = await this.getPartner(onboardingRequest);
    if (!partner) {
      partner = await this.getDefaultPartner(onboardingRequest);
    }

    if (partner) {
      await this.cacheManager.setData(
        cacheKey,
        JSON.stringify(partner),
        environment.partnerCacheCalculationsTTL,
      );
    }

    return partner;
  }

  public async updatePartnerCache(): Promise<void> {
    const onboardings: OnboardingDto[] = await this.onboardingModel.find();
    for (const onboarding of onboardings) {
      const cacheKey: string = this.prepareCacheKey({ name: onboarding.name });
      await this.cacheManager.setData(
        cacheKey,
        JSON.stringify(onboarding),
        environment.partnerCacheCalculationsTTL,
      );
    }

    for (const paymentFixture of PaymentFixtures) {
      const cacheKey: string = this.prepareCacheKey({
        country: paymentFixture.country,
        device: paymentFixture.device,
        method: paymentFixture.method,
        name: paymentFixture.name,
      });
      await this.cacheManager.delData(cacheKey);
    }
  }

  public async getPartnerRedirectedUrl(businessId: string, integration: string, redirectUrl: string): Promise<string> {
    const connection: IntegrationConnectionResponseDto = await this.getConnection(businessId, integration);
    const url: string =
      `${environment.microUrlThirdPartyProductsInternal}` +
      `/business/${businessId}/connection/${connection._id}/action/get-redirect-auth-url`;

    return (await this.httpService.post<string>(url, { redirectUrl: redirectUrl }))
      .pipe(
        map((response: AxiosResponse<string>) => response.data),
        catchError(() => {
          throw new NotFoundException(`Cannot get redirect url`);
        }),
      ).toPromise();
  }

  public async getConnection(businessId: string, integration: string): Promise<IntegrationConnectionResponseDto> {
    const url: string =
      `${environment.microUrlThirdPartyProductsInternal}/business/${businessId}/connection/${integration}`;

    const request: Observable<any> = await this.httpService.get(url);

    const res: any = await request.pipe(
      map((response: AxiosResponse<[]>) => {
        return response.data;
      }),
      catchError(() => {
        throw new NotFoundException(
          `Not found connection for business:"${businessId}", integration: "${integration}"`,
        );
      }),
    ).toPromise();

    if (res.length === 0) {
      throw new NotFoundException(
        `Not found connection for business:"${businessId}", integration: "${integration}"`,
      );
    }

    return res[0];
  }

  private prepareCacheKey(onboardingRequest: OnboardingRequestDto): string {
    let cacheKey: string = `onboarding_${onboardingRequest.name}`;
    cacheKey = onboardingRequest.method ? `${cacheKey}_${onboardingRequest.method}` : cacheKey;
    cacheKey = onboardingRequest.country ? `${cacheKey}_${onboardingRequest.country}` : cacheKey;
    cacheKey = onboardingRequest.device ? `${cacheKey}_${onboardingRequest.device}` : cacheKey;

    return cacheKey;
  }

  private filterIntegrations(
    onboarding: OnboardingDto,
    onboardingRequest: OnboardingRequestDto,
  ): ActionDto[] {
    return onboarding.afterRegistration.filter((action: ActionDto) => {
      let matched: boolean = true;
      if (!!action.integration) {
        matched = matched && action.integration.name === onboardingRequest.name as OnboardingPaymentNameEnum;

        matched = matched && onboardingRequest.method ?
          action.integration.method === onboardingRequest.method : matched;
        matched = matched && onboardingRequest.country ?
          action.integration.country === onboardingRequest.country : matched;
        matched = matched && onboardingRequest.device ?
          action.integration.device === onboardingRequest.device : matched;
      }

      return matched;
    });
  }

  private async filterAppsByOrigin(actions: ActionDto[], originName: string): Promise<ActionDto[]> {
    const originApps: string[] | null = await this.originAppService.findAppIdsByOrigin(originName);
    if (originApps) {
      return actions.map((action: ActionDto) => {
        if (action.name === 'install-apps' && action.payload && Array.isArray(action.payload.apps)) {
          action.payload.apps = action.payload.apps.filter((app: ActionAppInterface) => originApps.includes(app.app));
        }

        return action;
      });
    }

    return actions;
  }

  private getCustomOnboardingName(onboardingRequest: OnboardingRequestDto): string {
    return [onboardingRequest.name,
    onboardingRequest.country,
    onboardingRequest.device,
    onboardingRequest.method].filter((pathPart: string) => !!pathPart).join('-');
  }

  private replaceOnboardingName(onboarding: OnboardingDto, onboardingRequest: OnboardingRequestDto): OnboardingDto {
    if (onboarding) {
      onboarding.logo = onboarding.logo.replace('{onboardingName}', onboardingRequest.name);
      onboarding.wallpaperUrl = onboarding.wallpaperUrl.replace('{onboardingName}', onboardingRequest.name);
    }

    return onboarding;
  }

}
