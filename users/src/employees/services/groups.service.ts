import { InjectModel } from '@nestjs/mongoose';
import { Model, PopulateOptions } from 'mongoose';
import { Injectable } from '@nestjs/common';

import { GroupsSchemaName } from '../schemas';
import { Group } from '../interfaces';
import { GroupListingDto } from '../dto/group-listing.dto';
import { AddGroupDto, EmployeesDto, PatchGroupDto } from '../dto';
import { EventsProducer } from '../producer';
import { RabbitMessagesEnum } from '../enum';

@Injectable()
export class GroupsService {
  constructor(
    @InjectModel(GroupsSchemaName) private readonly groupsModel: Model<Group>,
    private readonly eventProducer: EventsProducer,
  ) { }

  public async addToGroups(employeeId: string, groups: string[]): Promise<any> {
    return this.groupsModel.updateMany({ _id: { $in: groups } }, { $addToSet: { employees: employeeId } as never});
  }

  public async getGroups(employeeId: string, select: string[] = ['_id', 'name']): Promise<any> {
    return this.groupsModel.find({ employees: employeeId }).select(select);
  }

  public async getGroupById(groupId: string): Promise<Group> {
    return this.groupsModel.findOne({ _id: groupId });
  }

  public async getGroupsByEmployeeId(employeeId: string): Promise<Group[]> {
    return this.groupsModel.find({ employees: employeeId });
  }

  public async getList(businessId: string, groupListingDto: GroupListingDto)
    : Promise<{ count: number; data: Group[] }> {
    let regexSearch: any = { };
    const sort: any = groupListingDto.order;
    const regexFilters: any = groupListingDto.filter;
    const limit: number = groupListingDto.limit as number;
    const page: number = groupListingDto.page as number;
    const populateQuery: PopulateOptions[] = groupListingDto.populate;
    if (groupListingDto.search) {
      regexSearch = { name: groupListingDto.search};
    }

    const count: number = await this.groupsModel.countDocuments({ businessId, ...regexFilters, ...regexSearch });
    const data: Group[] = await this.groupsModel
      .find({ businessId, ...regexFilters, ...regexSearch }, null, { sort, limit, skip: (page - 1) * limit })
      .populate(populateQuery);

    return {
      count,
      data,
    };
  }

  public async create(dto: AddGroupDto, businessId: string): Promise<Group> {
    const group: Group = await this.groupsModel.create({
      businessId,
      ...dto,
    });
    
    await this.eventProducer.sendMessage(
      {
        businessId,
        dto,
        id: group._id,
      },
      RabbitMessagesEnum.GroupCreated,
    );
    
    return group;
  }

  public async update(group: Group, dto: PatchGroupDto, businessId: string): Promise<Group> {
    const updatedGroup: Group = await this.groupsModel.findOneAndUpdate(
        { _id: group.id },
        {
          $set: {
            ...dto,
          },
        },
        { new: true },
      );
    
    await this.eventProducer.sendMessage(
      {
        businessId,
        dto,
        originalGroup: group,
      },
      RabbitMessagesEnum.GroupUpdated,
    );

    return updatedGroup;
  }

  public async remove(group: Group, businessId: string): Promise<Group> {    
    await this.eventProducer.sendMessage(
      {
        businessId,
        group,
      },
      RabbitMessagesEnum.GroupRemoved,
    );

    return group.remove();
  }

  public async removeFromGroup(group: Group, businessId: string, employees: EmployeesDto): Promise<Group> {     
    await this.eventProducer.sendMessage(
      {
        businessId,
        employees,
        group,
      },
      RabbitMessagesEnum.GroupRemovedEmployee,
    );

    return this.groupsModel.findByIdAndUpdate(
      group.id,
      { $pull: { employees: { $in: employees.employees } as never } },
      { new: true },
    );
  }

  public async addToGroup(group: Group, businessId: string, employees: EmployeesDto): Promise<Group> {    
    await this.eventProducer.sendMessage(
      {
        businessId,
        employees,
        group,
      },
      RabbitMessagesEnum.GroupAddEmployee,
    );

    return this.groupsModel.findOneAndUpdate(
      { _id: group.id },
      { $addToSet: { employees: { $each: employees.employees } as never } },
      { new: true },
    );
  }
}
