import { ForbiddenException, Injectable } from '@nestjs/common';
import { AccessValidatorInterface, AclConfigInterface, JwtAuthGuard } from '@pe/nest-kit';
import { CustomAccessEnum } from '../enums';
import { Reflector } from '@nestjs/core';
import { CustomAccessModel } from '../models';
import { DiscoveryService } from '@pe/nest-kit/modules/discovery';
import { CustomAccessService } from '../services';

@Injectable()
export class CustomGuard extends JwtAuthGuard {
  constructor(
    protected readonly reflector: Reflector,
    protected readonly discovery: DiscoveryService,
    protected readonly customAccessService: CustomAccessService,
  ) {
    super(
      reflector,
      discovery,
    );
  }

  protected async validate(
    request: any,
    rolesReflection: string[],
    aclReflection: AclConfigInterface[],
  ): Promise<boolean> {
    const accessId: string = request.headers.access ? request.headers.access
      : ( request.query.access ? request.query.access : null );

    if (accessId && await this.checkAccess(request, accessId)) {
      return true;
    }

    const validators: AccessValidatorInterface[] = await this.getValidators();
    for (const validator of validators) {
      if (await validator.isValid(request, rolesReflection, aclReflection)) {
        return true;
      }
    }

    throw new ForbiddenException({
      error: 'Forbidden',
      message: 'app.permission.insufficient.error.on.custom.guard.user.employee',
      statusCode: 403,
    });
  }

  private async checkAccess(
    request: any,
    accessId: string,
  ): Promise<boolean> {
    const access: CustomAccessModel = await this.customAccessService.findByAccessId(
      accessId,
    );

    if (access && this.checkUrl(request, access)) {
      if (access.access === CustomAccessEnum.builderEditor) {
        return true;
      }

      if (access.access === CustomAccessEnum.builderViewer && request.method === 'GET') {
        return true;
      }
    }

    return false;
  }

  private checkUrl(request: any, access: CustomAccessModel): boolean {
    let correctUrl: boolean = false;
    for (const url of access.urls) {
      if (request.url.indexOf(url) !== -1) {
        correctUrl = true;
      }
    }

    return correctUrl;
  }
}
