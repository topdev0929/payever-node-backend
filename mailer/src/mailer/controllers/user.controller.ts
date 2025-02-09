import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { SingleMailService } from '../services';
import { JwtAuthGuard, Roles, RolesEnum, User, UserTokenInterface } from '@pe/nest-kit';
import { SingleMailDto } from '../dto';

@Controller('/user')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
export class UserController {
  constructor(
    private readonly logger: Logger,
    private readonly singleMailService: SingleMailService,
  ) { }

  @Post('/send')
  public async userMail(
    @User() user: UserTokenInterface,
    @Body() dto: SingleMailDto,
  ): Promise<void> {
    this.logger.log('sending email');
    await this.singleMailService.send(dto);
  }
}
