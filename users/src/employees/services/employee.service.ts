import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  HttpService,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateEmployeeDto } from '../dto';
import { Employee, Group, PositionInterface } from '../interfaces';
import { EmployeeSchemaName, GroupsSchemaName } from '../schemas';
import { EmployeeFilterInterface } from '../interfaces/employee-filter.interface';
import { EmployeeSearchInterface } from '../interfaces/employee-search.interface';
import { EmployeeOrderInterface } from '../interfaces/employee-order.interface';
import { EmployeeConfirmation } from '../dto/employees/confirmation';
import { Positions, RabbitMessagesEnum, Status } from '../enum';
import { EventsProducer } from '../producer';
import { BusinessModel, BusinessService, UserDocument, UserService } from '../../user';
import { UserTokenInterface } from '@pe/nest-kit';
import { Observable } from 'rxjs';
import { AxiosError, AxiosResponse } from 'axios';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments';
import { EmployeeDetailSchemaName } from '../schemas/employee-detail.schema';
import { EmployeeDetail } from '../interfaces/employee-detail.interface';

@Injectable()
export class EmployeeService {
  constructor(
    private readonly eventProducer: EventsProducer,
    private readonly httpService: HttpService,
    private readonly logger: Logger,

    @Inject(forwardRef(() => BusinessService))
    private readonly businessService: BusinessService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @InjectModel(EmployeeSchemaName) private readonly employeeModel: Model<Employee>,
    @InjectModel(EmployeeDetailSchemaName) private readonly employeeDetailModel: Model<EmployeeDetail>,
    @InjectModel(GroupsSchemaName) private readonly groupsModel: Model<Group>,
  ) { }

  public async findBy(conditions: any): Promise<Employee[]> {
    return this.employeeModel.find(conditions);
  }

  public async getAggregatedEmployeeDetailsByConditions<T>(conditions: any[]): Promise<T[]> {
    return this.employeeDetailModel.aggregate<T>(conditions);
  }

  public async getEmployeeIdsByCondition(conditions: any): Promise<string[]> {
    return this.employeeModel.distinct('_id',conditions);
  }

  public async findOneBy(conditions: any): Promise<Employee> {
    return this.employeeModel.findOne(conditions);
  }

  public async findEmployeeDetail(employee: Employee, businessId: string): Promise<Employee> {

    const result: EmployeeDetail = await this.employeeDetailModel.findOne({
      deleted: false,
      employeeId: employee._id,
      'position.businessId': businessId,
    });

    if (result) {

      return this.mergeEmployeeDetail(employee, result);
    }

    return employee;
  }

  public async listEmployees(
    businessId: string,
    filter: EmployeeFilterInterface,
    search: EmployeeSearchInterface,
    order: EmployeeOrderInterface,
    limit: number,
    page: number,
  ): Promise<{ data: Employee[]; count: number }> {

    const mainPipeline: any[] = [
      { $match: { 'positions.businessId': businessId } },
      { $unwind: '$positions' },
      { $match: { 'positions.businessId': businessId } },
      {
        $lookup:
        {
          from: 'employeedetails',
          localField: '_id',
          foreignField: 'employeeId',
          as: 'detailEmployee',
        },
      },
      {
        $unwind: {
          path: '$detailEmployee',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          $or: [
            {
              'detailEmployee.position.businessId': businessId,
              'detailEmployee.deleted': false,
            },
            { detailEmployee: null },
          ],
        },
      },
      {
        $project: {
          _id: 1,
          address: this.createCondition('address'),
          companyName: this.createCondition('companyName'),
          email: 1,
          email_i: { $toLower: '$email' },
          first_name: this.createCondition('firstName'),
          firstName: this.createCondition('firstName'),
          fullName: {
            $cond: {
              else: { $concat: ['$firstName', ' ', '$lastName'] },
              if: {
                $anyElementTrue: [['$detailEmployee']],
              },
              then: { $concat: ['$detailEmployee.firstName', ' ', '$detailEmployee.lastName'] },
            },
          },
          last_name: this.createCondition('lastName'),
          lastName: this.createCondition('lastName'),
          logo: this.createCondition('logo'),
          phoneNumber: this.createCondition('phoneNumber'),
          positions: 1,
          roles: 1,
        },
      },
      { $addFields: { status: { $toString: '$positions.status' } } },
      {
        $addFields: {
          nameAndEmail: {
            $cond: {
              else: '$email',
              if: {
                $eq: ['$status', Status.active],
              },
              then: { $concat: ['$firstName', ' ', '$lastName'] },
            },
          },
        },
      },
    ];

    const countPipeline: any[] = [...mainPipeline];

    const match: any = { $match: { } };
    if (search) {
      match.$match.$or = [
        { email: search },
        { fullName: search },
        { firstName: search },
        { lastName: search },
        { nameAndEmail: search },
        { companyName: search },
        { phoneNumber: search },
      ];
    }

    const paginationData: any = {
      '$facet': {
        'data': [
          {
            '$skip': limit * (page - 1),
          },
          {
            '$limit': limit,
          },
        ],
      },
    };

    if (filter) {
      match.$match = { ...match.$match, ...filter };
    }
    countPipeline.push(match);
    countPipeline.push({
      $group: {
        _id: null,
        count: { $sum: 1 },
      },
    });

    mainPipeline.push(match);
    mainPipeline.push({ $sort: order });

    mainPipeline.push(paginationData);
    mainPipeline.push({ $unwind: '$data' });
    mainPipeline.push({
      $group: {
        _id: '0',
        count: { $first: '$count' },
        data: { $push: '$$ROOT.data' },
      },
    });

    const [countResult]: Array<{ count: number }> = await this.employeeModel.aggregate(countPipeline);
    const [dataResult = { count: 0, data: [], _id: '0' }]: Array<{ data: any; count: number; _id: string }> | null =
      await this.employeeModel.aggregate(mainPipeline);

    return {
      count: countResult ? countResult.count : 0,
      data: dataResult.data.map((employee: any) => ({ ...employee, positions: [employee.positions] })),
    };
  }

  private createCondition(field: string): any {
    return {
      $cond: {
        else: `$${field}`,
        if: {
          $anyElementTrue: [['$detailEmployee']],
        },
        then: `$detailEmployee.${field}`,
      },
    };
  }

  public async deleteEmployee(employee: Employee, sendRmqMessage: boolean = true): Promise<void> {
    if (!employee) {
      return;
    }

    await this.groupsModel.updateMany({ employees: employee.id }, { $pull: { employees: employee.id } as never });


    await this.employeeModel.findByIdAndDelete(employee.id);

    if (sendRmqMessage) {
      await this.eventProducer.sendMessage(
        {
          employee,
        },
        RabbitMessagesEnum.EmployeeRemoved,
      );
    }
  }

  public async removeEmployeeFromBusiness(employee: Employee, businessId: string): Promise<Employee> {

    await this.eventProducer.sendMessage(
      {
        businessId,
        employee,
      },
      RabbitMessagesEnum.EmployeeRemoved,
    );

    [employee] = await Promise.all([
      this.employeeModel.findByIdAndUpdate(
        employee.id,
        {
          $pull: {
            positions: { businessId } as never,
          },
        },
        { new: true },
      ),
      this.groupsModel.updateMany({ employees: employee.id }, { $pull: { employees: employee.id } as never }),
      this.employeeDetailModel.updateMany({
        employeeId: employee.id,
        'position.businessId': businessId,
      }, {
        $set: {
          deleted: true,
        },
      }),
    ]);

    let userId: string = employee.userId;    
    
    if(!userId){
      const userData: UserDocument = await this.userService.findByEmail(employee.email);
      userId = userData._id;
    }
    
    await this.businessService.removeBusinessActive(userId, businessId);

    return employee;
  }

  public async upsert(employee: Employee): Promise<void> {
    await this.employeeModel.updateOne({ _id: employee._id }, { $set: employee }, { upsert: true });
  }

  public async markInviteMailSent(employeeId: string, businessId: string): Promise<Employee> {
    return this.employeeModel.findOneAndUpdate(
      { _id: employeeId, 'positions.businessId': businessId },
      { $set: { 'positions.$.inviteMailSent': true } },
      { new: true },
    );
  }

  public async update(
    user: UserTokenInterface,
    businessId: string,
    employee: Employee,
    dto: UpdateEmployeeDto,
    customAccess: boolean = false,
    confirmEmployee: boolean = false,
  ): Promise<Employee> {

    const business: BusinessModel = await this.businessService.findBusiness(
      businessId
    );
    const owner: UserDocument = await this.userService.findById(
      business?.owner as string
    );

    if (owner && owner.userAccount?.email === dto.email) {
      throw new BadRequestException(
        'You\'re trying to add the owner of the business as an employee, which is strictly prohibited! Please don\'t do it.'
      );
    }

    if (user.email === employee.email) {
      throw new BadRequestException(
        'You attempted to modify your own information/permissions, which is not allowed.'
      );
    }

    if (user.email === dto.email) {
      throw new BadRequestException(
        'You attempted to add your own email to another employee, which is not allowed.'
      );
    }

    if (!user.isOwner) {
      for (const position of employee.positions) {
        if (position.businessId === businessId && position.positionType === Positions.admin) {
          if (dto.position !== Positions.admin) {
            throw new BadRequestException('You cannot change admin position');
          }

          if (dto.acls) {
            const data: any = await this.fetchAuth(businessId, employee.id);
            const diff = data.acls.filter((
              {
                microservice: m1,
                create: c1,
                read: r1,
                update: u1,
                delete: d1,
              }: any,
            ) => !dto.acls.some((
              {
                microservice: m2,
                create: c2,
                read: r2,
                update: u2,
                delete: d2,
              }: any,
            ) => m1 === m2 && c1 === c2 && r1 === r2 && u1 === u2 && d1 === d2));

            if (diff.length > 0) {
              throw new BadRequestException('You cannot change admin access');
            }
          }
        }
      }
    }

    const message: string = customAccess ?
      RabbitMessagesEnum.EmployeeUpdatedCustomAccess : RabbitMessagesEnum.EmployeeUpdated;

    await this.eventProducer.sendMessage(
      {
        businessId,
        confirmEmployee,
        dto,
        employee,
      },
      message,
    );
    const businessPosition: PositionInterface = employee.positions.find(
      (position: PositionInterface) => position.businessId === businessId,
    );
    const positions: Positions = dto.position;
    const status: Status = dto.status || businessPosition.status;
    delete dto.position;
    delete dto.status;

    const employeeDetail: EmployeeDetail = { ...dto } as unknown as EmployeeDetail;
    if (dto.firstName) {
      delete dto.firstName;
    }
    if (dto.lastName) {
      delete dto.lastName;
    }
    const updateResult: [EmployeeDetail, Employee] = await Promise.all([
      this.employeeDetailModel.findOneAndUpdate(
        { employeeId: employee.id, 'position.businessId': businessId, deleted: false },
        { $set: { 'positions.positionType': positions, 'position.status': status, ...employeeDetail } },
        { new: true },
      ),
      this.employeeModel.findOneAndUpdate(
        { _id: employee.id, 'positions.businessId': businessId },
        { $set: { 'positions.$.positionType': positions, 'positions.$.status': status, ...dto } },
        { new: true },
      ),
    ]);

    let result: EmployeeDetail = updateResult[0];
    const employeeResult: Employee = updateResult[1];

    if (!result) {
      result = await this.employeeDetailModel.create({
        userId: employeeResult.userId,
        firstName: employeeDetail.firstName || employeeResult.firstName,
        lastName: employeeDetail.lastName || employeeResult.lastName,
        logo: employeeDetail.logo || employeeResult.logo,
        employeeId: employee._id,
        companyName: employeeDetail.companyName || employeeResult.companyName,
        phoneNumber: employeeDetail.phoneNumber || employeeResult.phoneNumber,
        address: employeeDetail.address || employeeResult.address,
        position: {
          businessId,
          positionType: positions,
          status: status,
        },
        language: employeeResult.language,
        isActive: true,
      } as EmployeeDetail);
    }

    return this.mergeEmployeeDetail(employeeResult, result);
  }

  public async updateEmployee(employee: Employee, dto: UpdateEmployeeDto): Promise<Employee> {
    await this.eventProducer.sendMessage(
      {
        businessId: null,
        dto,
        employee,
      },
      RabbitMessagesEnum.EmployeeUpdated,
    );

    return this.employeeModel.findOneAndUpdate(
      { _id: employee.id },
      { $set: { ...dto } },
      { new: true },
    );
  }

  public async employeePosition(email: string, businessId: string): Promise<PositionInterface | null> {
    const employee: Employee = await this.employeeModel.findOne({ email });

    if (!employee) {
      return null;
    }

    return employee.positions?.find(
      (position: PositionInterface) => position.businessId === businessId,
    );
  }

  public static checkAccess(employee: Employee, businessId: string): void | never {
    if (employee.positions && employee.positions.length) {
      for (const position of employee.positions) {
        if (businessId === position.businessId) {
          return;
        }
      }
    }

    throw new NotFoundException('No such employee found within the specified business');
  }

  public async canDeleteEmployee(
    user: UserTokenInterface,
    employee: Employee,
    businessId: string,
  ): Promise<void | never> {
    if (employee.email && user.email === employee.email) {
      throw new ForbiddenException('You cannot remove yourself');
    }

    if (user.email !== employee.email && employee.positions && employee.positions.length) {
      for (const position of employee.positions) {
        if (position.positionType === Positions.admin) {
          const currentUserPosition = await this.getPositionByEmailAndBusiness(user.email, businessId);
          if (currentUserPosition !== Positions.admin) {
            throw new ForbiddenException('Admin cannot be deleted');
          }
        }
      }
    }
  }

  public static checkUpdatedEmployeeInfo(dto: UpdateEmployeeDto, employee: Employee): void | never {
    if (employee.email && dto.email !== employee.email) {
      throw new BadRequestException('User can not change employee email');
    }
  }

  public async countByEmail(email: string, businessId: string): Promise<number> {
    return this.employeeModel.countDocuments({ email, 'positions.businessId': businessId });
  }

  public async confirmEmployee(
    confirmation: EmployeeConfirmation,
    employee: Employee,
  ): Promise<void> {

    await this.employeeModel.findOneAndUpdate(
      { _id: employee.id },
      {
        $set: {
          firstName: confirmation.firstName,
          isActive: true,
          isVerified: true,
          lastName: confirmation.lastName,
        },
      },
    );
  }

  public async confirmEmployeeInBusiness(
    businessId: string,
    employee: Employee,
  ): Promise<void> {
    await this.employeeModel.findOneAndUpdate(
      { _id: employee.id, 'positions.businessId': businessId },
      {
        $set: {
          'positions.$.status': Status.active,
        },
      },
    );
  }

  public async populateEmployeesInGroup(group: Group, businessId: string): Promise<Group> {
    group = group.toObject();
    const populatedEmployees: any[] = [];
    for (const employee of group.employees) {
      const populatedEmployee: Employee = await this.findOneBy({ _id: employee });
      if (populatedEmployee) {
        const position: PositionInterface = populatedEmployee.positions.find(
          (_position: PositionInterface) => _position.businessId === businessId,
        );
        const status: Status = position.status;
        populatedEmployees.push({
          _id: populatedEmployee.id,
          email: populatedEmployee.email,
          first_name: populatedEmployee.firstName,
          last_name: populatedEmployee.lastName,
          firstName: populatedEmployee.firstName,
          lastName: populatedEmployee.lastName,
          status,
        });
      }
    }
    group.employees = populatedEmployees;

    return group;
  }

  public mergeEmployeeDetail(employee: Employee, employeeDetail: EmployeeDetail): Employee {
    const employeeDetailResult = employeeDetail.toObject();
    delete employeeDetailResult.employeeId;
    delete employeeDetailResult.position;

    return {
      ...employeeDetailResult,
      id: employee.id,
      _id: employee._id,
      email: employee.email,
      positions: employee.positions,
      isVerified: employee.isVerified,
    } as unknown as Employee;
  }

  private async getPositionByEmailAndBusiness(
    email: string,
    businessId: string,
  ): Promise<string> {
    const employee: Employee = await this.findOneBy({ email });
    if (!employee) {
      return ;
    }

    for (const position of employee.positions) {
      if (position.businessId === businessId) {
        return position.positionType;
      }
    }
  }

  private async fetchAuth(
    businessId: string,
    employeeId: string,
  ): Promise<any> {
    if (!environment.authUrl) {
      this.logger.log(`Environment variable 'MICRO_URL_AUTH' is not set`);

      return null;
    }

    let data: any;

    const response: Observable<AxiosResponse> = this.httpService.get(
      `${environment.authUrl}/api/employees/business/${businessId}/get-acls/${employeeId}`,
      { },
    );

    try {
      await response.pipe(
        map(async (res: any) => {
          data = res.data;
        }),
        catchError((error: AxiosError) => {
          throw error;
        }),
      ).toPromise();
    } catch (e) {
      this.logger.log(
        {
          error: e.message,
          message: `filed to get acls by business and user`,
        }
      );

      return null;
    }

    return data;
  }
}
