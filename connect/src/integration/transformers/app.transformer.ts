import { AppDto, IntegrationDto } from '../dto';
import { environment } from '../../environments';

export class AppTransformer {

  public static appToIntegration(
    app: AppDto,
  ): IntegrationDto {
    return {
      _id: app._id,
      category: app.category,
      connect: {
        formAction: {
          actionEndpoint: `/business/{businessId}/integration/${app.key}/action/{action}`,
          initEndpoint: `/business/{businessId}/integration/${app.key}/form`,
        },
        url: AppTransformer.findUrlByCategory(app.category),
      },
      displayOptions: {
        icon: app.icon,
        title: app.title,
        titleTranslations: app.titleTranslations,
      },
      enabled: app.enabled,
      installationOptions: {
        category: app.category,
        countryList: app.countryList,
        description: app.description,
        developer: app.developer,
        developerTranslations: app.developerTranslations,
        languages: app.languages ? app.languages.toString() : '',
        links: app.links,
        price: app.price,
      },
      name: app.key,
      scopes: app.scopes,
    };
  }

  private static findUrlByCategory(category: string): string {
    const urls: any = {
      messaging: `${environment.thirdPartyCommunicationsUrl}/api`,
      payments: `${environment.thirdPartyPaymentsUrl}/api`,
      products: `${environment.thirdPartyProductsUrl}/api`,
      shipping: `${environment.thirdPartyShippingUrl}/api`,
      social: `${environment.thirdPartyShippingUrl}/api`,
    };

    return urls[category];
  }
}
