/* eslint-disable @typescript-eslint/unbound-method */
import { Controller, Get, HttpCode,
  HttpStatus, Patch, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ParamModel } from '@pe/nest-kit';
import { Acl, AclActionsEnum, JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';
import { BusinessModel } from '../../business/models';
import { MongooseModel } from '../../common/enums';
import { WidgetTutorialStateInterface } from '../interfaces';
import { WidgetModel, WidgetTutorialModel } from '../models';
import { WidgetTutorialService } from '../services';

@Controller('business/:businessId/widget-tutorial')
@ApiTags('widget')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Roles(RolesEnum.merchant)
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid authorization token.' })
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
export class WidgetTutorialController {
  constructor(
    private readonly tutorialService: WidgetTutorialService,
  ) { }

  @Get()
  @Acl({ microservice: 'commerceos', action: AclActionsEnum.read })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    description: 'Widgets tutorial list for business.',
    isArray: true,
    status: HttpStatus.OK,
  })
  public async findAll(
    @ParamModel('businessId', MongooseModel.Business) business: BusinessModel,
  ): Promise<Array<{ }>> {
    const tutorialList: WidgetTutorialStateInterface[] =
      await this.tutorialService.getWidgetsTutorialStateByBusiness(business);

    return tutorialList.map((item: WidgetTutorialStateInterface) => ({
      //  item.widget.tutorial.$init not exist after mongoose update
      //  keep it from item.widget to save backward compatibility
      //  need to check if it is used in FE
      //  $init: item.widget.$init,

      // eslint-disable-next-line @typescript-eslint/dot-notation
      $init: item.widget['$init'],
      _id: item.widget._id,
      ...item.widget.tutorial,
      order: item.widget.order,
      type: item.widget.type,
      watched: item.watched,
    }));
  }

  @Patch(':widgetId/watched')
  @Acl({ microservice: 'commerceos', action: AclActionsEnum.read })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, description: 'The widget tutorial has been successfully marked.' })
  public async install(
    @ParamModel('widgetId', MongooseModel.Widget) widget: WidgetModel,
    @ParamModel('businessId', MongooseModel.Business) business: BusinessModel,
  ): Promise<{ }> {
    const tutorial: WidgetTutorialModel =
      await this.tutorialService.markWatched(widget, business);

    return {
      order: tutorial.order,
      type: tutorial.widget.type,
      watched: tutorial.watched,
    };
  }

}
