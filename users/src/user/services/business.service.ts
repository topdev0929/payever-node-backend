import * as crypto from 'crypto';

import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { EventDispatcher } from '@pe/nest-kit';
import { Model, UpdateQuery, Query } from 'mongoose';
import { mapKeys, omit, Dictionary } from 'lodash';

import { CreateBusinessDto, CurrentWallpaperBusDto } from '../dto';
import { BusinessEventsEnum, ThemeEnum } from '../enums';
import { BusinessModel, BusinessDetailModel, UserModel, BusinessActiveModel } from '../models';
import {
  BusinessSchemaName,
  BusinessDetailSchemaName,
  UserSchemaName,
  EmailSettingsSchemaName,
  BusinessActiveSchemaName,
} from '../schemas';
import { CountryInfoService } from './country-info.service';
import { MailerEventProducer, BusinessEventsProducer } from '../producers';
import { mergeDeep } from '../utils';
import { EmailSettingsModel } from '../models/email-settings.model';
import { environment } from '../../environments';
import { EmailSettingsInterface, WallpaperInterface } from '../interfaces';
import { EmployeeService } from '../../employees/services/employee.service';
import { Employee, PositionInterface } from '../../employees/interfaces';
import { OutgoingServerSettingsInterface } from '../interfaces/outgoing-server-settings.interface';

const encryptor: crypto.Cipher = crypto.createCipheriv(
  'aes256',
  environment.secretsEncryptionKey,
  environment.secretsEncryptionIv,
);

@Injectable()
export class BusinessService {

  constructor(
    @InjectModel(UserSchemaName) private readonly userModel: Model<UserModel>,
    @InjectModel(BusinessSchemaName) private readonly businessModel: Model<BusinessModel>,
    @InjectModel(BusinessDetailSchemaName) private readonly businessDetailModel: Model<BusinessDetailModel>,
    @InjectModel(EmailSettingsSchemaName) private readonly emailSettingsModel: Model<EmailSettingsModel>,
    @InjectModel(BusinessActiveSchemaName) private readonly businessActiveModel: Model<BusinessActiveModel>,
    private countryService: CountryInfoService,
    private readonly mailerEventsProducer: MailerEventProducer,
    private readonly jwtService: JwtService,
    private readonly eventDispatcher: EventDispatcher,
    private readonly businessEventsProducer: BusinessEventsProducer,
    private readonly employeeService: EmployeeService,
  ) {
  }

  public async pushBusinessToUser(user: UserModel, business: BusinessModel): Promise<void> {
    user.businesses.push(business._id);
    await user.save();
  }

  public async removeBusinessFromUser(user: UserModel, business: BusinessModel ): Promise<void> {
    await this.userModel.findByIdAndUpdate(
      user._id,
      {
        $pull: {
          businesses: business._id,
        },
      },
    );

  }

  public async setFirstUserBusinessAsActive(ownerId: string): Promise<void> {
    const user: UserModel = await this.userModel.findOne({ _id: ownerId });
    const businessId: string | null = user.businesses?.length ? user.businesses[0] : null;

    if (businessId) {
      const business: BusinessModel = await this.businessModel.findOne({ _id: businessId });
      await this.updateBusiness(business, { active: true });
    }
  }

  public async assignBusiness(business: BusinessModel, user: UserModel): Promise<void> {
    if (user && business && !user.businesses.includes(business.id)) {
      await this.pushBusinessToUser(user, business);
    }
  }

  public async deassignBusiness(business: BusinessModel, user: UserModel): Promise<void> {
    if (user && business) {
      await this.removeBusinessFromUser(user, business);
    }
  }

  public async createBusiness(
    user: UserModel,
    createBusinessDto: CreateBusinessDto,
  ): Promise<BusinessModel> {
    const businessDto: CreateBusinessDto = mergeDeep(
      createBusinessDto,
      {
        _id: createBusinessDto.id,
        owner: user.id,

        contactDetails: {
          firstName: user.userAccount.firstName,
          lastName: user.userAccount.lastName,
        },
        currency: this.countryService.getCountryCurrency(createBusinessDto.companyAddress?.country),
        themeSettings: {
          theme: ThemeEnum.dark,
        },
      },
    );

    if (!businessDto.defaultLanguage && createBusinessDto.companyAddress && createBusinessDto.companyAddress.country) {
      businessDto.defaultLanguage = this.countryService.getCountryLanguage(createBusinessDto.companyAddress.country);
    }

    const business: BusinessModel = await this.businessModel.create(businessDto as any);
    const businessDetail: BusinessDetailModel = await this.businessDetailModel.create({
      _id: business._id,
      ...businessDto,
    } as any);

    business.businessDetail = businessDetail._id;
    business.registrationOrigin = user.registrationOrigin?.source;
    await business.save();

    await this.pushBusinessToUser(user, business);

    await business.populate('businessDetail').execPopulate();
    await this.eventDispatcher.dispatch(BusinessEventsEnum.BusinessCreated, business);

    return business;
  }

  public async findBusiness(businessId: string): Promise<BusinessModel | null> {
    return this.businessModel.findOne({ _id: businessId });
  }
  
  public async findBusinessIdsByOwner(userId: string): Promise<string[]> {
    return this.businessModel.distinct('_id',
      {
        owner: userId,
      },
    );
  }


  public async updateBusiness(business: BusinessModel, update: any): Promise<BusinessModel> {
    const { businessDetail, ...updateRest } : { [key: string]: any } = update;

    await this.businessModel.findOneAndUpdate(
      { _id: business.id },
      {
        $set: updateRest,
      },
      {
        context: 'query',
        runValidators: true,
      },
    );

    if (businessDetail || updateRest.name) {
      await this.businessDetailModel.updateOne(
        { _id: business._id},
        {
          $set: {
            ...businessDetail,
            name: updateRest.name,
          },
        },
      );
    }

    const updatedBusiness: BusinessModel = await this.businessModel.findOne({ _id: business.id });

    if (updateRest.active) {
      await this.enableBusiness(updatedBusiness);
    }

    await this.eventDispatcher.dispatch(BusinessEventsEnum.BusinessUpdated, business, updatedBusiness);

    return updatedBusiness;
  }

  public async enableBusiness(business: BusinessModel, user: UserModel = null): Promise<void> {
    if (user && !await this.isEmployee(business, user)) {
      return ;
    }

    await this.businessActiveModel.findOneAndUpdate(
      { owner: user && user._id ? user._id : business.owner },
      { $set: { businessId: business.id } },
      { upsert: true, setDefaultsOnInsert: true },
    );
  }

  public async getBusinessActive(owner: string): Promise<BusinessActiveModel> {
    return this.businessActiveModel.findOne(
      {
        owner,
      },
    );
  }

  public async isBusinessActive(owner: string, business: string): Promise<boolean> {
    const active: BusinessActiveModel = await this.getBusinessActive(owner);
    if (active) {
      return active.businessId === business;
    }

    return null;
  }

  public async deleteBusiness(business: BusinessModel): Promise<void> {
    const ownerId: string = business.owner as string;
    
    await business.populate({
      path: 'owner',
      select: '-businesses',
    }).execPopulate();

    await this.businessModel.findByIdAndDelete(business.id).exec();

    const usersWithBusiness: UserModel[] = await this.userModel.find({
      businesses: {
        $elemMatch: {
          $eq: business.id,
        },
      },
    }).exec();

    for (const user of usersWithBusiness) {
      await this.removeBusinessFromUser(user, business);
    }

    const activeBusiness: BusinessActiveModel = await this.getBusinessActive(ownerId);

    if (!activeBusiness || !await this.businessModel.findOne({ _id: activeBusiness?.businessId })) {
      await this.setFirstUserBusinessAsActive(ownerId);
    }

    await this.eventDispatcher.dispatch(BusinessEventsEnum.BusinessRemoved, business);
  }

  public async deleteBusinessesByOwner(user: UserModel): Promise<void> {
    const businesses: BusinessModel[] = await this.businessModel.find({ owner: user._id });

    for (const business of businesses) {
      await this.deleteBusiness(business);

      await this.businessEventsProducer.produceBusinessRemovedEvent(user, business);
    }
  }

  public async getList(query: any, limit: number, skip: number): Promise<BusinessModel[]> {
    return this.businessModel.find(query).limit(limit).skip(skip);
  }

  public async getOwnedBusinesses(ownerId: string): Promise<BusinessModel[]> {
    return this.businessModel.find({ owner: ownerId });
  }

  public async removeBusinessesForOwner(owner: UserModel): Promise<void> {
    await this.businessModel.remove({ owner }).exec();
    await owner.populate('businessDocuments').execPopulate();
    for (const business of owner.businessDocuments) {
      await this.eventDispatcher.dispatch(BusinessEventsEnum.BusinessRemoved, business);
    }
    owner.businesses = [];
    await owner.save();
  }

  public getEmailSettings(business: BusinessModel): Query<EmailSettingsModel, EmailSettingsModel> {
    return this.emailSettingsModel.findOne({
      _id: business._id,
    });
  }

  public async sendOwnershipInvite(
    business: BusinessModel,
    inviteeEmail: string,
  ): Promise<void> {
    const invitee: UserModel = await this.userModel.findOne({ 'userAccount.email': inviteeEmail });

    if (!invitee) {
      throw new BadRequestException('Invalid invitee email');
    }

    const emailToken: string = this.jwtService.sign(
      { ownerId: business.owner, newOwnerId: invitee._id, businessId: business._id }, 
      { expiresIn: '1d' },
    );

    const link: string = `${environment.commerceOsUrl}/verification/owner?token=${emailToken}`;

    await this.mailerEventsProducer
      .produceOwnerInvitationEmailMessage(
        business.name,
        inviteeEmail,
        link,
        invitee.userAccount.firstName,
        invitee.userAccount.lastName,
        business.defaultLanguage,
      );
  }

  public async transferOwnership(newOwnerId: string, businessId: string): Promise<void> {
    
    const business: BusinessModel = await this.businessModel.findOne({ _id: businessId });
    const newOwner: UserModel = await this.userModel.findOne({ _id: newOwnerId });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    if (!newOwner) {
      throw new NotFoundException('User not found');
    }

    const employeePosition: PositionInterface = await this.employeeService.employeePosition(
      newOwner.userAccount.email,
      business._id
    );
    if (employeePosition) {
      const employee: Employee = await this.employeeService.findOneBy({ email: newOwner.userAccount.email });
      await this.employeeService.removeEmployeeFromBusiness(employee, business._id);
    }

    const businesssWithUpdatedOwner: BusinessModel = await this.businessModel.findOneAndUpdate(
      { _id: businessId }, 
      { $set: { owner: newOwnerId } }, 
      { new: true },
    );

    await this.userModel.updateOne(
      { _id: business.owner as string }, 
      { $pull: { businesses: business._id } },
    );

    await this.userModel.updateOne(
      { _id: newOwnerId },
      { $addToSet: { businesses: businessId }},
    );

    await this.setFirstUserBusinessAsActive(business.owner as string);

    await this.businessEventsProducer.produceBusinessUpdatedEvent(newOwner, businesssWithUpdatedOwner);
    await this.businessEventsProducer.produceBusinessOwnerTransferEvent(
      businesssWithUpdatedOwner, 
      business.owner as string,
    );
  }

  public async forceTransferOwnership(business: BusinessModel, newOwnerEmail: string): Promise<void> {
    
    const newOwner: UserModel = await this.userModel.findOne({ 'userAccount.email': newOwnerEmail });

    if (!newOwner) {
      throw new BadRequestException('Invalid new owner email');
    }

    await this.transferOwnership(newOwner._id, business._id);
  }

  public async updateEmailSettings(
    business: BusinessModel,
    dataToUpdate: UpdateQuery<EmailSettingsModel>,
  ): Promise<EmailSettingsModel> {
    const outgoingServerSettings: OutgoingServerSettingsInterface = dataToUpdate.outgoingServerSettings;
    const outgoingServerSettingsDictionary: Dictionary<any> = mapKeys(
      outgoingServerSettings,
      (_: any, key: string) => `outgoingServerSettings.${key}`,
    );
    const outgoinServerSettingsPassword: string = outgoingServerSettings.password;
    if (outgoinServerSettingsPassword) {
      let encrypted: string = encryptor.update(outgoinServerSettingsPassword, 'utf8', 'hex');
      encrypted += encryptor.final('hex');
      outgoingServerSettingsDictionary['outgoingServerSettings.password'] = encrypted;
    }
    const updated: EmailSettingsModel = await this.emailSettingsModel.findOneAndUpdate(
      {
        _id: business._id,
      },
      {
        $set: {
          ...omit(dataToUpdate, 'outgoingServerSettings'),
          ...outgoingServerSettingsDictionary,
          businessId: business._id,
        },
      },
      {
        new: true,
        upsert: true,
      },
    );

    await this.businessEventsProducer.produceBusinessSecretEmailSettingsUpdatedEvent(
      business,
      updated,
    );

    return updated;
  }

  public toPasswordLessSettingsLeanObject(
    emailSetting: EmailSettingsModel,
  ): EmailSettingsInterface {
    const lean: EmailSettingsInterface = emailSetting.toObject();
    lean.outgoingServerSettings.password = null;

    return lean;
  }

  public async updateCurrentWallpaper(
    currentWallpaperBusDto: CurrentWallpaperBusDto,
  ): Promise<void> {
    const currentWallpaper: WallpaperInterface = {
      name: currentWallpaperBusDto.currentWallpaper.name ? currentWallpaperBusDto.currentWallpaper.name : '',
      theme: currentWallpaperBusDto.currentWallpaper.theme,
      wallpaper: currentWallpaperBusDto.currentWallpaper.wallpaper,
    };

    await this.businessModel.updateOne(
      {
        _id: currentWallpaperBusDto.businessId,
      },
      {
        $set : {
          currentWallpaper: currentWallpaper,
        },
      },
    );
  }

  public async removeBusinessActive(userId: string, businessId: string): Promise<void> {
    await this.businessActiveModel.remove(
      {
        owner: userId,
        businessId: businessId,
      },
    );
  }

  private async isEmployee(business: BusinessModel, user: UserModel): Promise<boolean> {
    let allowed: boolean = false;
    const employees: Employee[] = await this.employeeService.findBy({ userId: user._id });

    for (const employee of employees) {
      for (const position of employee.positions) {
        if (position.businessId === business._id) {
          allowed = true;
          break;
        }
      }
    }

    if (user.businesses.includes(business.id)) {
      allowed = true;
    }

    return user._id === business.owner || allowed;
  }
}
