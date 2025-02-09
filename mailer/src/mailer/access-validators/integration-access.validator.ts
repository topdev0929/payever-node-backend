import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AccessValidator, AccessValidatorInterface } from '@pe/nest-kit/modules/auth';
import { Model } from 'mongoose';
import { IntegrationAccessModel } from '../models';
import { MailerRolesEnum } from '../enum';
import { IntegrationAccessSchemaName } from '../schemas/integration-access.schema';

@Injectable()
@AccessValidator()
export class IntegrationAccessValidator implements AccessValidatorInterface {
  constructor(
    @InjectModel(IntegrationAccessSchemaName) private readonly integrationAccessModel: Model<IntegrationAccessModel>,
  ) { }

  public async isValid(
    request: any,
    controllerRolesList: string[],
  ): Promise<boolean> {
    if (!Array.isArray(controllerRolesList) || !controllerRolesList.includes(MailerRolesEnum.integration)) {
      return false;
    }

    const token: string = request.headers['integration-access-token'];
    if (!token) {
      return false;
    }

    const access: IntegrationAccessModel = await this.integrationAccessModel.findOne({
      token: token,
    });

    return !!access;
  }
}
