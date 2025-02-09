import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Delete,
  UseGuards,
  Param,
  ForbiddenException,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  JwtAuthGuard,
  Roles,
  RolesEnum,
  TokensResultModel,
  User,
  UserTokenInterface,
} from '@pe/nest-kit';
import {
  LocationInterface,
} from '../interfaces';
import { LocationService } from '../services';

const INVALID_CREDENTIALS_MESSAGE: string = 'Invalid credentials';
const ACCESS_GRANTED: string = 'Access granted.';

@Controller('api')
@ApiTags('locations')
export class LocationsController {
  constructor(
    private readonly locationService: LocationService,
  ) { }

  @Get('/locations')
  @Roles(RolesEnum.user)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: ACCESS_GRANTED })
  public async getLocations(
    @User() user: UserTokenInterface,
  ): Promise<LocationInterface[]> {
    return this.locationService.getLocations(user);
  }

  @Patch('/locations/:locationId')
  @Roles(RolesEnum.user)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: ACCESS_GRANTED })
  public async updateName(
    @Param('locationId') locationId: string,
    @User() user: UserTokenInterface,
    @Body() location: { name: string },
  ): Promise<LocationInterface> {
    if (!await this.locationService.getLocationsById(user, locationId)) {
      throw new ForbiddenException('You do not have access to this location');
    }

    return this.locationService.updateLocationName(locationId, location.name);
  }

  @Delete('/locations/:locationId')
  @Roles(RolesEnum.user)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: TokensResultModel, description: ACCESS_GRANTED })
  public async removeLocation(
    @User() user: UserTokenInterface,
    @Param('locationId') locationId: string,
  ): Promise<void> {
    if (!await this.locationService.getLocationsById(user, locationId)) {
      throw new ForbiddenException('You do not have access to this location');
    }

    await this.locationService.removeLocation(locationId);
  }
}
