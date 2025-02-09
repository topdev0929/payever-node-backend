import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

import { GroupsSchemaName } from '../schemas';
import { Group } from '../interfaces';
import { AclInterface } from '@pe/nest-kit';
import { ALL_APPS } from '../../users/constants';
import { Acl } from '../../users';
import { EventsProducer } from '../producer';
import { RabbitMessagesEnum } from '../../common';

export const TRUSTED_DOMAIN_GROUP_NAME: string = 'trusted-domain-group';

@Injectable()
export class GroupsService {
  constructor(
    @InjectModel(GroupsSchemaName) private readonly groupsModel: Model<Group>,
    private readonly eventsProducer: EventsProducer,
  ) { }

  public async addToGroups(employeeId: string, groups: string[]): Promise<any> {
    return this.groupsModel.updateMany({ _id: { $in: groups } }, { $addToSet: { employees: employeeId } as never });
  }

  public async getGroups(
    employeeId: string, 
    businessId: string, 
    select: string[] = ['_id', 'name'],
  ): Promise<any> {
    return this.groupsModel.find({ employees: employeeId, businessId }).select(select);
  }

  public async getGroupById(groupId: string): Promise<Group> {
    return this.groupsModel.findOne({ _id: groupId });
  }

  public async findOrCreateDefaultTrustedDomainGroup(businessId: string): Promise<Group> {
    let group: Group = await this.groupsModel.findOne({ businessId, name: TRUSTED_DOMAIN_GROUP_NAME });

    if (!group) {

      const acls: Acl[] = ALL_APPS.map((app: any) => {
        return {
          create: true,
          delete: true,
          microservice: app.code,
          read: true,
          update: true,
        };
      });
      
      await this.groupsModel.create({
        acls,
        businessId,
        name: TRUSTED_DOMAIN_GROUP_NAME,
      });

      group = await this.groupsModel.findOne({ businessId, name: TRUSTED_DOMAIN_GROUP_NAME });

      await this.eventsProducer.sendMessage(group.toObject(), RabbitMessagesEnum.TrustedDomainGroupCreated);
    }

    return group;
  }

  public static getEnabledAcls(acls: AclInterface[]): AclInterface[] {
    return acls
      .map((acl: any) => {
        const enabledAcl: AclInterface = { microservice: acl.microservice };
        if (acl && acl.toObject) {
          acl = acl.toObject();
        }
        for (const permission in acl) {
          if (permission !== 'microservice' && acl[permission]) {
            enabledAcl[permission] = true;
          }
        }
        if (Object.keys(enabledAcl).length > 1) {
          return enabledAcl;
        } else {
          return null;
        }
      })
      .filter((acl: AclInterface) => acl);
  }

  // Check if we have permissions enabled in another group. If yes, exclude it from the list of acls to be removed.
  public static disableAclDuplicate(original: AclInterface[], groups: Group[]): AclInterface[] {
    return original
      .map((acl: AclInterface) => {
        const newAcl: AclInterface = { microservice: acl.microservice };
        for (const permission in acl) {
          if (acl.hasOwnProperty(permission)) {
            groups.forEach((group: Group) => {
              const anotherGroupAcl: AclInterface | { } =
                group.acls.find((_acl: AclInterface) => _acl.microservice === acl.microservice) || { };
              if (permission !== 'microservice' && acl[permission] && !anotherGroupAcl[permission]) {
                newAcl[permission] = false;
              }
            });
          }
        }
        if (Object.keys(newAcl).length > 1) {
          return newAcl;
        } else {
          return null;
        }
      })
      .filter((acl: AclInterface) => acl);
  }

  public async getGroupsByEmployeeId(employeeId: string): Promise<Group[]> {
    return this.groupsModel.find({ employees: employeeId });
  }

  public async getAllTrustedDomainGroups(): Promise<Group[]> {
    return this.groupsModel.find({ name: TRUSTED_DOMAIN_GROUP_NAME });
  }
}
