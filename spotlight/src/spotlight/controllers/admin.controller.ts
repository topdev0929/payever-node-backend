import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';
import {
  Roles,
  RolesEnum,
  JwtAuthGuard,
  User,
  UserTokenInterface,
} from '@pe/nest-kit';

import { SearchDto } from '../dto';
import { SpotlightService } from '../services';


@Controller(`admin/spotlight`)
@ApiTags('spotlight')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
@ApiBearerAuth()
export class AdminSpotlightController {
  constructor(
    private readonly spotlightService: SpotlightService,
  ) { }

  @Get('/search')
  public async search(
    @User() user: UserTokenInterface,
    @Query() dto: SearchDto,
  ): Promise<any> {
    return this.spotlightService.search(dto, null, user);
  }
}
