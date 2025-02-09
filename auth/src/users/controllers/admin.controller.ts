import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
  Delete,
  Post,
  forwardRef,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, Roles, RolesEnum, UserRoleInterface, ParamModel } from '@pe/nest-kit';
import { classToPlain } from 'class-transformer';
import { Model } from 'mongoose';

import { DeleteUserByEmailDto } from '../dto/delete-user-by-email.dto';
import { UpdatePermissionsDto } from '../dto/update-permissions.dto';
import { User as UserModel } from '../interfaces';
import { UserDocumentSchema as UserDocument, UserSchemaName } from '../schemas';
import { UserEventProducer } from '../producer/user-event.producer';
import { UserService } from '../services';
import { SuspiciousActivityService } from '../../brute-force/services';
import { BlockUserDto, UnblockUsersDto, EditDto } from '../dto';
import { StringTools } from '../../brute-force/tools/string-tools';

const accessGrantedDescription: string = 'Access granted';
const INVALID_CREDENTIALS_MESSAGE: string = 'Invalid credentials';

@Controller('api/admin')
@ApiTags('admin')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
@ApiBearerAuth()
export class AdminController {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserModel>,
    private readonly userService: UserService,
    @Inject(forwardRef(() => SuspiciousActivityService))
    private readonly suspiciousActivityService: SuspiciousActivityService,
    private readonly userEventProducer: UserEventProducer,
  ) { }

  @Patch('/users/:userId')
  @Roles(RolesEnum.user)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, description: accessGrantedDescription })
  public async editRoles(@Param('userId') userId: string, @Body() dto: EditDto): Promise<UserModel> {
    return this.userModel.findOneAndUpdate({ _id: userId }, classToPlain(dto), { new: true });
  }

  @Get('/users/:userId')
  @Roles(RolesEnum.user)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, description: accessGrantedDescription })
  public async getUserAcls(
    @Param('userId') userId: string,
  ): Promise<UserRoleInterface[]> {
    const user: UserModel = await this.userService.findOneBy({ _id: userId });

    return this.userService.populatePermissions(user);
  }

  @Get('/users/:userId/user')
  @Roles(RolesEnum.admin)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, description: accessGrantedDescription })
  public async getUser(
    @Param('userId') userId: string,
  ): Promise<UserModel> {
    return this.userService.findOneBy({ _id: userId });
  }

  @Delete('/users/:userId')
  @Roles(RolesEnum.admin)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, description: accessGrantedDescription })
  public async deleteUser(
    @ParamModel('userId', UserSchemaName, true) targetUser: UserModel,
  ): Promise<void> {
    const removedUser: UserDocument = await targetUser.remove();
    await this.userEventProducer.produceUserRemovedEvent(removedUser);
  }

  @Delete('/users')
  @Roles(RolesEnum.admin)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, description: accessGrantedDescription })
  public async deleteUserByEmail(
    @Body() deleteUserDto: DeleteUserByEmailDto,
  ): Promise<void> {
    const targetUser: UserDocument =
      await this.userService.findOneBy({ email: deleteUserDto.email });
    if (!targetUser) {
      throw new NotFoundException();
    }

    const removedUser: UserDocument = await targetUser.remove();
    await this.userEventProducer.produceUserRemovedEvent(removedUser);
  }

  @Patch('/users/:userId/permissions')
  @Roles(RolesEnum.admin)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, description: accessGrantedDescription })
  public async updateUserPermissions(
    @Param('userId') userId: string,
    @Body() dto: UpdatePermissionsDto,
  ): Promise<void> {
    await this.userService.updateUserPermissions(userId, dto.permissions);
  }

  @Post('/users/block')
  @Roles(RolesEnum.admin)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, description: accessGrantedDescription })
  public async blockUser(
    @Body() dto: BlockUserDto,
  ): Promise<void> {
    await this.suspiciousActivityService.blockIp(dto.userIp);
  }

  @Delete('/users/block')
  @Roles(RolesEnum.admin)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, description: accessGrantedDescription })
  public async unblockUsers(
    @Body() dto: UnblockUsersDto,
  ): Promise<void> {
    if (!StringTools.isValidString(dto.userId) && !StringTools.isValidString(dto.userIp)) {
      throw new BadRequestException('At least one must be set between the two fields.');
    }
    
    return this.suspiciousActivityService.unblockUser(dto.userId, dto.userIp);
  }

  @Delete('/users/block/clear')
  @Roles(RolesEnum.admin)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, description: accessGrantedDescription })
  public async clearAllSuspiciousActivities(): Promise<void> {
    await this.suspiciousActivityService.clearAllActivities();
  }

  @Get('/users/block/:userIp')
  @Roles(RolesEnum.admin)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, description: accessGrantedDescription })
  public async isIpBlockedPermanently(
    @Param('userIp') userIp: string,
  ): Promise<boolean> {
    return this.suspiciousActivityService.isIpBlockedPermanently(userIp);
  }
}
