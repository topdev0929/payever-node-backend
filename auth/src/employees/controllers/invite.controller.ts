import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Acl,
  AclActionsEnum,
  JwtAuthGuard,
  ParamModel,
  Roles,
  RolesEnum,
  TokensResultModel,
  User,
  EventDispatcher,
  UserTokenInterface,
} from '@pe/nest-kit';

import {
  RequestFingerprint,
  FastifyRequestWithIpInterface,
} from '../../auth/interfaces';
import { RequestParser } from '../../auth/services';
import { EmployeeService, InvitationService } from '../services';
import { EmployeeSchemaName } from '../schemas';
import { Employee, PositionInterface } from '../interfaces';
import { EmployeeFormattingInterceptor } from '../interceptors';
import { EmployeeConfirmation } from '../dto/employees/confirmation';
import { EventsProducer } from '../producer';
import { CONFIRM_EMPLOYEE_EVENT } from '../constants';

import { ConfirmEmployeeDto, OwnerInviteDto } from '../dto';
import { UserService } from '../../users/services';
import { Status } from '../enum';
import { User as AuthUser } from '../../users';

const INVALID_CREDENTIALS_MESSAGE: string = 'Invalid credentials';

@Controller('api/employees')
@ApiTags('employees')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.anonymous)
export class InviteController {
  constructor(
    private readonly userService: UserService,
    private readonly invitationService: InvitationService,
    private readonly employeeService: EmployeeService,
    private readonly eventDispatcher: EventDispatcher,

  ) { }

  @Patch('/invite/:businessId/:userId')
  @Roles(RolesEnum.merchant)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, description: 'Send invitation' })
  @UseInterceptors(EmployeeFormattingInterceptor)
  @Acl({ microservice: 'settings', action: AclActionsEnum.update })
  public async invite(
    @Param('businessId') businessId: string,
    @ParamModel(':userId', EmployeeSchemaName, true) employee: Employee,
  ): Promise<Employee> {
    EmployeeService.checkAccess(employee, businessId);

    return this.invitationService.invite(employee, businessId);
  }

  @Post('owner-invite')
  @Roles(RolesEnum.merchant)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, description: 'Re-invite employees' })
  @Acl({ microservice: 'settings', action: AclActionsEnum.create })
  public async inviteByBusinessOwner(
    @User() user: UserTokenInterface,
    @Body() dto: OwnerInviteDto,
  ): Promise<any> {
    return this.invitationService.inviteByBusinessOwner(user, dto.status, !!dto?.dryRun);
  }

  @Patch('/invite')
  @Roles(RolesEnum.admin)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, description: 'Send invitation' })
  @UseInterceptors(EmployeeFormattingInterceptor)
  public async inviteByAdmiin(): Promise<void> {
    await this.invitationService.inviteAllEmployee();
  }

  @Get('/verify')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: 'Confirm invitation' })
  public async verify(
    @Query('token') token: string,
    @Req() request: FastifyRequestWithIpInterface,
  ): Promise<TokensResultModel> {
    return this.invitationService.verify(token, request);
  }

  @Patch('/confirm/:id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: 'Confirm employee' })
  public async confirmEmployee(
    @ParamModel(':id', EmployeeSchemaName, true) employee: Employee,
    @Body() confirmation: EmployeeConfirmation,
    @Req() request: FastifyRequestWithIpInterface,
  ): Promise<TokensResultModel> {
    const parsedRequest: RequestFingerprint = RequestParser.parse(request);
    await this.eventDispatcher.dispatch(
      CONFIRM_EMPLOYEE_EVENT,
      { parsedRequest, recaptchaToken: confirmation.recaptchaToken },
    );

    return this.employeeService.confirmEmployee(confirmation, employee, request);
  }

  @Post('/confirm/:businessId/:employeeId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: 'Confirm employee' })
  public async confirmEmployeeInBusiness(
    @ParamModel(':employeeId', EmployeeSchemaName, true) employee: Employee,
    @Body() dto: ConfirmEmployeeDto,
    @Param('businessId') businessId: string,
    @Req() request: FastifyRequestWithIpInterface,
  ): Promise<TokensResultModel> {
    employee = await this.employeeService.updateUserId(employee);

    const parsedRequest: RequestFingerprint = RequestParser.parse(request);
    await this.eventDispatcher.dispatch(
      CONFIRM_EMPLOYEE_EVENT,
      { parsedRequest, recaptchaToken: dto.recaptchaToken },
    );

    return this.employeeService.confirmEmployeeInBusiness(businessId, employee, request);
  }

  @Get(':id/isRegistered')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, description: 'Check if user registered' })
  public async isRegistered(
    @ParamModel(':id', EmployeeSchemaName, true) employee: Employee,
  ): Promise<boolean> {
    return !!(await this.userService.findOneByEmail(employee.email));
  }

  @Get('invite-data/:businessId/:employeeId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({
    description: 'Check if user registered and if user has been verified to business',
    status: HttpStatus.OK,
  })
  public async inviteData(
    @Param('businessId') businessId: string,
    @ParamModel(':employeeId', EmployeeSchemaName, true) employee: Employee,
  ): Promise<{ isRegistered: boolean; isVerifiedToBusiness: boolean }> {
    const user: AuthUser | undefined = await this.userService.findOneByEmail(employee.email);
    const businesssPosition: PositionInterface | undefined = employee.positions?.find((position: PositionInterface) => {
      return position.businessId === businessId && position.status === Status.active;
    });

    return {
      isRegistered: !!user,
      isVerifiedToBusiness: !!businesssPosition,
    };
  }
}
