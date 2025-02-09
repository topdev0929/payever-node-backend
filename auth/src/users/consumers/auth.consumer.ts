import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { EventDispatcher } from '@pe/nest-kit';
import { AssignAbsolutePermissionsDto, RegisterDto } from '../dto';
import { RegisterEvent, User } from '../interfaces';
import { RegistrationService, UserService } from '../services';
import { REGISTER_EVENT } from '../constants';

@Controller()
export class AuthRpcConsumer {
  constructor(
    private readonly registrationService: RegistrationService,
    private readonly userService: UserService,
    private readonly eventDispatcher: EventDispatcher,
  ) { }

  @MessagePattern({
    name: 'auth.rpc.user.create',
  })
  public async onUserCreateEvent(dto: RegisterDto): Promise<User> {
    const isValid: boolean = await this.registrationService.isUserExist(dto);

    const registerEvent: RegisterEvent = {
      bulkEventId: undefined,
      isInvitedEmployee: false,
      isRpc: true,
      isValid,
      parsedRequest: { },
      registerDto: dto,
    };
    await this.eventDispatcher.dispatch(
      REGISTER_EVENT,
      registerEvent,
    );

    return this.registrationService.registerUser(dto);
  }

  @MessagePattern({
    name: 'auth.rpc.user.reset-password',
  })
  public async onUserResetPasswordEvent(dto: { email: string }): Promise<void> {
    return this.registrationService.forgotPassword(dto.email, 'en');
  }

  @MessagePattern({
    name: 'auth.rpc.user.assign-absolute-permissions',
  })
  public async assignAbsolutePermissions(dto: AssignAbsolutePermissionsDto): Promise<void> {
    await this.userService.assignAbsolutePermissions(dto.userId, dto.businessId);
  }
}
