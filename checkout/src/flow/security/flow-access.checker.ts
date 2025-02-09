import { ForbiddenException, Injectable } from '@nestjs/common';
import {
  AccessTokenPayload,
  Hash,
  RolesEnum,
  TokensGenerationService,
  UserRoleInterface,
  UserRoleMerchant,
  UserSessionInterface,
} from '@pe/nest-kit';
import { FastifyRequest } from 'fastify';
import { FlowModel } from '../models';
import { AuthClient } from '../clients';
import { TokenHelper } from '@pe/nest-kit/modules/auth/token.helper';
import { plainToClass } from 'class-transformer';
import { FlowAuthorizationRequestDto } from '../dto';

@Injectable()
export class FlowAccessChecker {
  constructor(
    private readonly authClient: AuthClient,
    private readonly tokensGenerationService: TokensGenerationService,
  ) { }

  public async assignFlowVisibility(
    flow: FlowModel,
    user: AccessTokenPayload,
    request: FastifyRequest<any>,
  ): Promise<void> {
    if (!user) {
      const userAgent: string = request.headers['user-agent'];
      const ipHash: string = Hash.generate(request.ip);
      flow.guestToken = await this.authClient.issueGuestToken(userAgent, ipHash);
      const decodedToken: any = TokenHelper.extractTokenString(flow.guestToken);
      user = plainToClass(AccessTokenPayload, decodedToken.user);
    }

    const sessionData: UserSessionInterface = user.session || { paymentFlowIds: [], paymentIds: [] };
    sessionData.paymentFlowIds.push(flow.id);

    await this.tokensGenerationService.updateSessionData(user.tokenId, sessionData);
  }

  public async authorizeFlowForToken(
    flow: FlowModel,
    flowAuthorizationRequestDto: FlowAuthorizationRequestDto,
  ): Promise<void> {
    const decodedToken: any = TokenHelper.extractTokenString(flowAuthorizationRequestDto.token);
    const user: AccessTokenPayload = plainToClass(AccessTokenPayload, decodedToken.user);

    const sessionData: UserSessionInterface = user.session || { paymentFlowIds: [], paymentIds: [] };
    sessionData.paymentFlowIds.push(flow.id);

    await this.tokensGenerationService.updateSessionData(user.tokenId, sessionData);
  }

  public async checkFlowAccess(
    flow: FlowModel,
    user: AccessTokenPayload,
  ): Promise<void> {
    const sessionData: UserSessionInterface = user.session || { paymentFlowIds: [], paymentIds: [] };
    const allowedBySessionData: boolean = sessionData.paymentFlowIds.includes(flow.id);
    const allowedByMerchantRole: boolean =
      user.roles.some((role: UserRoleInterface) => {
        if (role.name !== RolesEnum.merchant) {
          return false;
        }

        const merchantRole: UserRoleMerchant = role as UserRoleMerchant;
        for (const permission of merchantRole.permissions) {
          if (permission.businessId === flow.businessId) {
            return true;
          }
        }

        return false;
      });

    if (allowedBySessionData || allowedByMerchantRole) {
      return;
    }

    throw new ForbiddenException('Flow access is not allowed');
  }
}
