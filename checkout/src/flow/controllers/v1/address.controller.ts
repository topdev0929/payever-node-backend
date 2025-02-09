import { Controller, Get, Query, Param, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit';
import { FastifyRequest } from 'fastify';
import { Place } from '@googlemaps/google-maps-services-js';
import { GoogleMapsClient } from '../../clients';
import { AddressAutocompleteResponseDto } from '../../dto';

@Controller('flow/v1/address')
@ApiTags('flow')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class AddressController {
  constructor(
    private readonly googleMapsClient: GoogleMapsClient,
  ) { }

  @Get('search')
  @Roles(RolesEnum.anonymous, RolesEnum.merchant, RolesEnum.guest)
  public async searchAddress(
    @Query('q') query: string,
    @Query('sessionId') sessionId: string,
    @Req() request: FastifyRequest<any>,
  ): Promise<AddressAutocompleteResponseDto[]> {
    return this.googleMapsClient.getAutocompletePlaces(query, sessionId);
  }

  @Get('details/:placeId')
  @Roles(RolesEnum.anonymous, RolesEnum.merchant, RolesEnum.guest)
  public async getPlaceDetails(
    @Param('placeId') placeId: string,
    @Query('sessionId') sessionId: string,
    @Req() request: FastifyRequest<any>,
  ): Promise<Place> {
    return this.googleMapsClient.getPlaceDetails(placeId, sessionId);
  }
}
