import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AbstractController } from '@pe/nest-kit';
import { BuilderIntegrationDto } from '../dto';
import { SubscriptionMediaService, UserMediaService } from '../services';

@Controller(`/studio/integration/builder`)
@ApiTags('User Media API')
export class IntegrationController extends AbstractController{
  constructor(
    private readonly userMediaService: UserMediaService,
    private readonly subscriptionMediaService: SubscriptionMediaService,
  ) {
    super();
  }


  @Post(`user-media`)
  public async getUserMedia(
      @Body() dto: BuilderIntegrationDto,
  ): Promise<any> {
    const data: any = await this.userMediaService.findBuilderUserMedia(
      dto.businessId,
      dto.filter,
      dto.pagination.order,
      dto.pagination.offset,
      dto.pagination.limit,
    );

    return data.result;
  }

  @Post(`subscription-media`)
  public async getSubscriptionMedia(
      @Body() dto: BuilderIntegrationDto,
  ): Promise<any> {
    const data: any = await this.subscriptionMediaService.findBuilderSubscriptionMedia(
      dto.contextId,
      dto.filter,
      dto.pagination.order,
      dto.pagination.offset,
      dto.pagination.limit,
    );

    return data.result;
  }
}
