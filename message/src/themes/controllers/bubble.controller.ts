import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';
import {
  Roles,
  RolesEnum,
  ParamModel,
  JwtAuthGuard,
  AclActionsEnum,
  Acl,
} from '@pe/nest-kit';
import { BusinessSchemaName } from '@pe/business-kit';
import { BusinessLocalDocument as BusinessModel } from '../../projections/models';
import { BusinessLocal as BusinessInterface } from '../../projections/schema';

import { UpdateBubbleDto } from '../dto';
import { BubbleModel } from '../models';
import { BubbleService } from '../services';
import { BubbleInterface } from '../interfaces';

@Controller(`business/:businessId/bubble`)
@ApiTags('bubble')
export class BubbleController {
  constructor(
    private readonly bubbleService: BubbleService,
  ) { }

  @Get()
  public async getBubble(
    @ParamModel(':businessId', BusinessSchemaName, true) business: BusinessModel,
    @Param('businessId') swaggerBusinessId: string,
  ): Promise<BubbleInterface & {
    businessDocument: Pick<BusinessInterface, 'name' | 'logo'>;
  }> {
    const bubble: BubbleModel = await this.bubbleService.findOneByBusiness(business._id);

    return {
      ...bubble.toJSON(),
      businessDocument: {
        logo: business.logo,
        name: business.name,
      },
    };
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Roles(RolesEnum.admin, RolesEnum.merchant)
  @Acl({ microservice: 'message', action: AclActionsEnum.update })
  public async editBubble(
    @ParamModel(':businessId', BusinessSchemaName, true) business: BusinessModel,
    @Param('businessId') swaggerBusinessId: string,
    @Body() dto: UpdateBubbleDto,
  ): Promise<BubbleInterface & {
    businessDocument: Pick<BusinessInterface, 'name' | 'logo'>;
  }> {
    const updatedBubble: BubbleModel = await this.bubbleService.update(business, dto);

    return {
      ...updatedBubble.toJSON(),
      businessDocument: {
        logo: business.logo,
        name: business.name,
      },
    };
  }
}
