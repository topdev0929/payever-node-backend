import { MessagePattern } from '@nestjs/microservices';
import { Body, Controller } from '@nestjs/common';

import { RabbitMessagesEnum } from '../../common';
import { BusinessTagDto } from '../dto';
import { BusinessService } from '../services/business.service';

@Controller()
export class RabbitController {
  constructor(private readonly businessService: BusinessService) { }

  @MessagePattern({
    name: RabbitMessagesEnum.AssignBusinessTag,
  })
  public async assignTagToBusiness(
    @Body() dto: BusinessTagDto,
  ): Promise<void> {
    return this.businessService.assignTag(dto);
  }

  @MessagePattern({
    name: RabbitMessagesEnum.RemoveBusinessTag,
  })
  public async removeTagFromBusiness(
    @Body() dto: BusinessTagDto,
  ): Promise<void> {
    return this.businessService.removeTag(dto);
  }
}
