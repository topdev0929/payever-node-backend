import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import {
    BusinessEventsEnum,
    BusinessMessagesHooksEnum,
    BusinessDto,
    BusinessService,
} from '@pe/business-kit';
import { plainToClass } from 'class-transformer';

import { UserModel } from '../../user/models';
import { BusinessModel } from '../models';
import { UserDto } from '../../user/dto';
import { UserService } from '../../user/services';
import { WidgetInstallationService } from '../../widget/services';

@Injectable()
export class BusinessEventListener {
  constructor(
    private readonly userService: UserService,
    private readonly businessService: BusinessService<BusinessModel>,
    private readonly widgetInstallationService: WidgetInstallationService,
  ) { }

  @EventListener(BusinessMessagesHooksEnum.BusinessPreCreatedHook)
  public async onBusinessPreCreated(createBusinessDto: BusinessDto): Promise<void>  {
    const userData: any = createBusinessDto.userAccount;
    userData._id = createBusinessDto.userAccountId;
    const createUserDto: UserDto = plainToClass(UserDto, userData as UserDto);

    if (!(await this.userService.findOneById(createUserDto._id))) {
        const user: UserModel = await this.userService.create(createUserDto);
        await this.widgetInstallationService.installWidgetsToUser(user);
    }
  }

  @EventListener(BusinessEventsEnum.BusinessCreated)
  public async onBusinessCreated(business: BusinessDto): Promise<void>  {
    const businessModel = await this.businessService.findOneById(business._id);
    await this.widgetInstallationService.installWidgetsToBusiness(businessModel);
  }

  @EventListener(BusinessEventsEnum.BusinessExport)
  public async onBusinessExport(business: BusinessDto): Promise<void>  {
    const businessModel = await this.businessService.findOneById(business._id);
    await this.widgetInstallationService.installWidgetsToBusiness(businessModel, true);
  }
}
