import { Body, Controller, Post, Param, UseGuards, NotFoundException } from '@nestjs/common';
import { AbstractController, Acl, AclActionsEnum, JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit';
import { ProductCheckoutLinkRequestDto } from '../dto';
import { environment } from '../../environments';
import { ChannelSetService } from '../../channel-set/services';
import { ChannelSetModel } from '../../channel-set/models';

@Controller('/product/checkout/:businessId')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
export class ProductsCheckoutController extends AbstractController {
  constructor(
    private readonly channelSetService: ChannelSetService,
  ) {
    super();
  }

  @Post('link')
  @Acl({ microservice: 'products', action: AclActionsEnum.read })
  public async getProductCheckoutLink(
    @Param('businessId') businessId: string,
    @Body() dto: ProductCheckoutLinkRequestDto,
  ): Promise<{ link: string }> {
    const channelSets: ChannelSetModel[] = await this.channelSetService.findByBusinessId(businessId);
    const channelSet: ChannelSetModel = channelSets.find((i: ChannelSetModel) => i.type === dto.type);
    
    if (!channelSet) {
      throw new NotFoundException(`Channel set not found with type ${dto.type}`);
    }

    return { link: `${environment.microUrlCheckout}/pay/create-flow/channel-set-id/${channelSet._id}?cart=${dto.productIds.join(',')}` };
  }
}
