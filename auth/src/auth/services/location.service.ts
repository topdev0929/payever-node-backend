import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { LocationInterface, RequestFingerprint } from '../interfaces';
import { LocationSchemaName } from '../schemas';
import { User } from '../../users/interfaces';
import { IpAddressEncoder } from '../../users';
import { UserTokenInterface } from '@pe/nest-kit';
import { environment } from '../../environments';

@Injectable()
export class LocationService {
  constructor(@InjectModel(LocationSchemaName) private readonly locationModel: Model<LocationInterface>) { }

  public async isLocationKnown(user: User, parsedRequest: RequestFingerprint): Promise<boolean> {
    const { ipSubnet, userAgent }: RequestFingerprint = parsedRequest;
    if (!ipSubnet || !user) {
      return false;
    }

    const hashedSubnet: string = IpAddressEncoder.encodeUsersIpAddress(ipSubnet, user.email);

    const existingLocation: LocationInterface = await this.locationModel.findOne({
      hashedSubnet,
      userAgent,
      userId: user ? user.id : null,
    }).exec();

    return !!existingLocation;
  }

  public async getLocation(user: User, parsedRequest: RequestFingerprint): Promise<LocationInterface> {
    const { ipSubnet, userAgent }: RequestFingerprint = parsedRequest;
    if (!ipSubnet || !user) {
      return null;
    }

    const hashedSubnet: string = IpAddressEncoder.encodeUsersIpAddress(ipSubnet, user.email);

    return this.locationModel.findOne({
      hashedSubnet,
      userAgent,
      userId: user ? user.id : null,
    }).exec();
  }

  public async addLocation(user: User, parsedRequest: RequestFingerprint): Promise<LocationInterface> {
    const { ipSubnet, userAgent }: RequestFingerprint = parsedRequest;
    if (!ipSubnet || !user) {
      return;
    }

    const hashedSubnet: string = IpAddressEncoder.encodeUsersIpAddress(ipSubnet, user.email);
    const userId: string | null = user ? user.id : null;

    return this.locationModel.create(
      {
        hashedSubnet,
        name: parsedRequest.device && parsedRequest.device !== 'Other' ? parsedRequest.device : parsedRequest.os,
        subnet: ipSubnet,
        userAgent,
        userId,
      },
    );
  }

  public async getLocations(user: UserTokenInterface): Promise<LocationInterface[]> {
    return this.locationModel.find(
      { userId: user.id },
    );
  }

  public async getLocationsById(user: UserTokenInterface, locationId: string): Promise<LocationInterface> {
    return this.locationModel.findOne(
      { userId: user.id, _id: locationId },
    );
  }

  public async updateLocationName(locationId: string, name: string): Promise<LocationInterface> {

    return this.locationModel.findOneAndUpdate(
      { _id: locationId },
      {
        $set: {
          name,
        },
      },
      {
        new: true,
      },
    );
  }

  public async verifyLocation(user: User, parsedRequest: RequestFingerprint): Promise<LocationInterface> {
    let location: LocationInterface = await this.getLocation(user, parsedRequest);

    if (!location) {
      location = await this.addLocation(user, parsedRequest);

      if (!location) {
        return;
      }
    }

    return this.locationModel.findOneAndUpdate(
      { _id: location._id },
      {
        $set: {
          verified: true,
        },
      },
      {
        new: true,
      },
    );
  }

  public async isLocationVerified(user: User, parsedRequest: RequestFingerprint): Promise<boolean> {
    if (user.generalAccount || environment.disableLocation2fa) {
      return true;
    }

    const location: LocationInterface = await this.getLocation(user, parsedRequest);

    return !!location && location.verified;
  }

  public async removeLocation(locationId: string): Promise<LocationInterface> {
    return this.locationModel.findOneAndDelete(
      { _id: locationId },
    );
  }
}
