import { Controller, Get, UseGuards, Param, Put, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { BusinessStepService } from '../services';
import { BusinessStepModel } from '../models';
import { SectionsEnum } from '../enums';
import { BusinessStepSchemaName } from '../schemas';
import { BusinessModel, businessModel } from '../../models/business.model';
import { Acl, AclActionsEnum } from '@pe/nest-kit/modules/auth';

@Controller('/stepper/steps/business/:businessId')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
export class BusinessStepController {
  constructor(
    private readonly businessStepService: BusinessStepService,
  ) { }

  @Get('/:sectionName')
  @Acl({ microservice: 'commerceos', action: AclActionsEnum.read })
  public async list(
    @Param('sectionName') sectionName: SectionsEnum,
    @ParamModel('businessId', businessModel.modelName) business: BusinessModel,
  ): Promise<BusinessStepModel[]> {
    return this.businessStepService.getListForSection(sectionName, business);
  }

  @Put('/:businessStepId')
  @Acl({ microservice: 'commerceos', action: AclActionsEnum.update })
  public async setActive(
    @ParamModel(':businessStepId', BusinessStepSchemaName) step: BusinessStepModel,
    @ParamModel(':businessId', businessModel.modelName) business: BusinessModel,
  ): Promise<BusinessStepModel> {

    if (step.businessId !== business.id) {
      throw new ForbiddenException();
    }

    return this.businessStepService.setActive(step, business);
  }
}
