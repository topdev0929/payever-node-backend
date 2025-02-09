// tslint:disable: no-commented-code
import { Injectable } from '@nestjs/common';
import { EventListener, RolesEnum, UserRoleMerchant, UserRoleTypes } from '@pe/nest-kit';

import { LoginEvent } from '../interfaces';
import { LOGIN_EVENT } from '../constants';
import { LocationMailerService, LocationService, TokenService } from '../services';
import { PermissionModel } from '../../users/models';
import { PermissionService } from '../../users';

@Injectable()
export class LoginListener {
  constructor(
    private readonly locationService: LocationService,
    private readonly locationMailer: LocationMailerService,
    private readonly tokenService: TokenService,
    private readonly permissionService: PermissionService,
  ) { }

  @EventListener({
    eventName: LOGIN_EVENT,
    priority: 10,
  })
  public async onLoginEvent(loginEvent: LoginEvent): Promise<void> {
    !loginEvent.user || await this.locationService.isLocationKnown(loginEvent.user, loginEvent.parsedRequest) ||
    (await Promise.all([
      this.locationMailer.sendSuspiciousLocationNotification(
        loginEvent.loginDto.email,
        loginEvent.parsedRequest,
        loginEvent.user.language,
      ),
      this.locationService.addLocation(loginEvent.user, loginEvent.parsedRequest),
    ]));

    if (loginEvent.isValidPassword) {

      const merchantRole: UserRoleMerchant = loginEvent.user.roles.find(
        (role: UserRoleTypes) => role.name === RolesEnum.merchant,
      ) as UserRoleMerchant;

      /* Add permission for business in token on login if only one business*/
      if (merchantRole && merchantRole.permissions.length === 1) {
        const permission: PermissionModel = await this.permissionService.findOneBy({
          _id: merchantRole.permissions[0],
        });

        const roleWithAcls: UserRoleMerchant = {
          name: RolesEnum.merchant,
          permissions: [
            {
              acls: permission.acls,
              businessId: permission.businessId,
            },
          ],
        };

        const index: number = loginEvent.user.roles.findIndex(
          (role: UserRoleTypes) => role.name === RolesEnum.merchant,
        );

        loginEvent.user.roles[index] = roleWithAcls;
      }
      loginEvent.response = await this.tokenService.issueToken(loginEvent.user, loginEvent.parsedRequest, null);

      // TODO: shop login implementation, not complete
      // if (!loginEvent.user) {
      //   return;
      // }

      // const customerRole: UserRoleCustomer = loginEvent.user.getRole(RolesEnum.customer);

      // if (!customerRole) {

      //   return;
      // }

      // if (customerRole && !loginEvent.loginDto.channelSetId) {
      //   return;
      // }

      // if (customerRole && LoginListener.customerHasShopAccess(customerRole, loginEvent.loginDto.channelSetId)) {
      //   loginEvent.response = await this.issueToken(loginEvent);


    }
  }

  //  private issueToken(loginEvent: LoginEvent): Promise<TokensResultModel> {
  //   loginEvent.user.roles = [LoginListener.createShopRolePayload(loginEvent.loginDto.channelSetId)];

  //   return this.tokenService.issueToken(loginEvent.user, loginEvent.parsedRequest);
  // }

  // private static supportsValidation(loginEvent: LoginEvent): boolean {
  //   return !!loginEvent.user && !!loginEvent.loginDto.channelSetId;
  // }

  // private static createShopRolePayload(channelSetId: string): UserRoleCustomer {
  //   return {
  //     name: RolesEnum.customer, shops: [{
  //       channelSetId: channelSetId,
  //       salt: '',
  //       shopPassword: '',
  //     }],
  //   };
  // }

  // private static customerHasShopAccess(customerRole: UserRoleCustomer, channelSetId: string): boolean {
  //   return customerRole.shops.some(
  //     (shop: ShopAccessInterface) =>
  //       shop.channelSetId === channelSetId,
  //   );
  // }
}
