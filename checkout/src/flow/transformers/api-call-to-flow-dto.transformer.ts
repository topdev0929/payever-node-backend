import { BusinessModel } from '../../business/models';
import { ChannelSetModel } from '../../channel-set/models';
import { FlowRequestDto } from '../dto';
import { VerifyTypeEnum } from '../../legacy-api/enum';
import { FlowCartItemInterface } from '../interfaces';
import { ApiCallModel } from '../../common/models';
import { ApiCallAddressInterface, ApiCallCartItemInterface } from '../../common/interfaces';
import { SalutationEnum } from '../../common/enum';

export class ApiCallToFlowDtoTransformer {
  public static apiCallToPaymentFlowDto(
    apiCall: ApiCallModel,
    business: BusinessModel,
    channelSet: ChannelSetModel,
    extraRawFlowData?: any,
  ): FlowRequestDto {
    const flowRequestDto: FlowRequestDto = {
      amount: Math.round((apiCall.amount - apiCall.fee + Number.EPSILON) * 100) / 100,
      apiCallId: apiCall.id,
      billingAddress: {
        addressLine2: apiCall.address_line_2,
        city: apiCall.city,
        country: apiCall.country,
        email: apiCall.email,
        firstName: apiCall.first_name,
        lastName: apiCall.last_name,
        phone: apiCall.phone,
        region: apiCall.region,
        salutation: apiCall.salutation || SalutationEnum.MR,
        street: ApiCallToFlowDtoTransformer.prepareStreetFromApiCallAddress(apiCall),
        streetName: apiCall.street_name,
        streetNumber: apiCall.street_number,
        zipCode: apiCall.zip,

        houseExtension: apiCall.house_extension,
        organizationName: apiCall.organization_name,
      },
      cart: ApiCallToFlowDtoTransformer.apiCallCartToFlowCart(apiCall),
      channelSetId: channelSet._id,
      channelSource: apiCall.channel_source || apiCall.plugin_version,
      connectionId: apiCall.variant_id,
      currency: apiCall.currency ? apiCall.currency : business.currency,
      deliveryFee: apiCall.fee,
      disableValidation: apiCall.disable_validation,
      downPayment: apiCall.down_payment,
      extra: {
        ...apiCall.extra,
        birthdate: apiCall.birthdate,
      },
      footerUrls: {
        disclaimer: apiCall.footer_urls?.disclaimer,
        logo: apiCall.footer_urls?.logo,
        privacy: apiCall.footer_urls?.privacy,
        support: apiCall.footer_urls?.support,
      },
      forceLegacyCartStep: apiCall.allow_cart_step,
      forceLegacyUseInventory: apiCall.use_inventory,
      hideImprint: apiCall.hide_imprint,
      hideLogo: apiCall.hide_logo,
      orderId: apiCall.order_ref,
      pluginVersion: apiCall.plugin_version,
      reference: apiCall.order_id,
    };

    if (apiCall.shipping_address) {
      const salutation: string =
        (apiCall.first_name === apiCall.shipping_address.first_name
        && apiCall.last_name === apiCall.shipping_address.last_name
        && !apiCall.shipping_address.salutation)
          ? apiCall.salutation
          : apiCall.shipping_address.salutation;

      flowRequestDto.shippingAddress = {
        addressLine2: apiCall.shipping_address.address_line_2,
        city: apiCall.shipping_address.city,
        country: apiCall.shipping_address.country,
        firstName: apiCall.shipping_address.first_name,
        lastName: apiCall.shipping_address.last_name,
        region: apiCall.shipping_address.region,
        salutation: salutation,
        street: ApiCallToFlowDtoTransformer.prepareStreetFromApiCallAddress(apiCall.shipping_address),
        streetName: apiCall.shipping_address.street_name,
        streetNumber: apiCall.shipping_address.street_number,
        zipCode: apiCall.shipping_address.zip,

        houseExtension: apiCall.shipping_address.house_extension,
        organizationName: apiCall.shipping_address.organization_name,
      };
    }

    if (apiCall.verify_type) {
      flowRequestDto.posVerifyType = this.verifyTypeToFlowType(apiCall.verify_type);
    }

    return {
      ...flowRequestDto,
      ...extraRawFlowData,
    };
  }

  public static prepareStreetFromApiCallAddress(
    apiCallAddress: ApiCallAddressInterface,
  ): string {
    if (!apiCallAddress) {
      return undefined;
    }

    let street: string = apiCallAddress.street;
    const streetNumber: string = apiCallAddress.street_number;
    const excludeStreetNumber: string[] = ['.', '-', 'none', '', 'N/A', undefined, null, street];
    if (!excludeStreetNumber.includes(streetNumber)) {
      street = [street, streetNumber].join(' ');
    }

    if (!street) {
      return street;
    }

    street = street.replace('\r', ' ');
    street = street.replace('\t', ' ');
    street = street.replace('\n', ' ');

    return street;
  }

  private static apiCallCartToFlowCart(apiCall: ApiCallModel): FlowCartItemInterface[] {
    if (!apiCall.cart) {
      return [];
    }

    const apiCallCart: ApiCallCartItemInterface[] = (typeof apiCall.cart === 'string')
      ? JSON.parse(apiCall.cart)
      : apiCall.cart;

    return apiCallCart.map((item: ApiCallCartItemInterface) => {
      return {
        extraData: item.extra_data,
        identifier: item.identifier,
        image: item.thumbnail,
        name: item.name,
        price: item.price,
        priceNet: item.price_netto,
        quantity: item.quantity,
        sku: item.sku,
        vat: item.vat_rate,

        attributes: item.attributes,
        brand: item.brand,
        category: item.category,
        imageUrl: item.image_url,
        productUrl: item.product_url,
        totalAmount: item.total_amount,
        totalDiscountAmount: item.total_discount_amount,
        totalTaxAmount: item.total_tax_amount,
        type: item.type,
      };
    });
  }

  private static verifyTypeToFlowType(verifyType: VerifyTypeEnum): number {
    switch (verifyType) {
      case VerifyTypeEnum.code:
        return 0;
      case VerifyTypeEnum.id:
        return 1;
      case VerifyTypeEnum.custom:
      default:
        return null;
    }
  }
}
