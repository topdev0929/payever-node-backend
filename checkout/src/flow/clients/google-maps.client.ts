import { HttpService, Injectable, Logger, PreconditionFailedException } from '@nestjs/common';
import { environment } from '../../environments';
import {
  Client,
  Place,
  PlaceAutocompleteResponse,
  PlaceAutocompleteResult,
  PlaceAutocompleteType,
  PlaceDetailsResponse,
} from '@googlemaps/google-maps-services-js';
import { AddressAutocompleteResponseDto } from '../dto';
import { AxiosInstance } from 'axios';

@Injectable()
export class GoogleMapsClient {
  public constructor(
    private readonly httpService: HttpService,
    private readonly logger: Logger,
  ) { }

  public async getAutocompletePlaces(
    query: string,
    sessionId?: string,
  ): Promise<AddressAutocompleteResponseDto[]> {
    const client: Client = this.initClient();

    let result: PlaceAutocompleteResponse;
    try {
      result = await client.placeAutocomplete({
        params: {
          input: query,
          key: environment.googleMapsApiKey,
          sessiontoken: sessionId,
          types: PlaceAutocompleteType.address,
        },
      });
    } catch (e) {
      this.logger.warn({
        details: e.response?.data?.error_message,
        error: e.message,
        message: 'Google autocomplete search failed',
      });

      throw new PreconditionFailedException('Google autocomplete search failed');
    }

    if (!result || result.data?.status !== 'OK') {
      this.logger.warn({
        error: result.data?.status,
        message: 'Google autocomplete search failed',
      });

      throw new PreconditionFailedException('Google autocomplete search failed');
    }

    return result?.data?.predictions?.map((value: PlaceAutocompleteResult) => {
      return {
        address: value.description,
        placeId: value.place_id,
      };
    }) || [];
  }

  public async getPlaceDetails(
    placeId: string,
    sessionId?: string,
  ): Promise<Place> {
    const client: Client = this.initClient();

    let details: PlaceDetailsResponse;
    try {
      details = await client.placeDetails({
        params: {
          key: environment.googleMapsApiKey,
          place_id: placeId,
          sessiontoken: sessionId,
        },
      });
    } catch (e) {
      this.logger.warn({
        details: e.response?.data?.error_message,
        error: e.message,
        message: 'Google get place details query failed',
      });

      throw new PreconditionFailedException('Google get place details query failed');
    }

    if (!details || details.data?.status !== 'OK') {
      this.logger.warn({
        error: details.data?.status,
        message: 'Google get place details query failed',
      });

      throw new PreconditionFailedException('Google get place details query failed');
    }

    return details?.data?.result;
  }

  private initClient(): Client {
    return new Client({ axiosInstance: this.httpService.axiosRef as any });
  }
}
