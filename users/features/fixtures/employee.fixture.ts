import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';

import { Employee, EmployeeDetail } from '../../src/employees/interfaces';
import { BusinessActiveModel, BusinessModel } from '../../src/user/models';
import { UserModel } from '../../src/user/models';

class EmployeesFixture extends BaseFixture {
  public async apply(): Promise<void> {
    const employeeModel: Model<Employee> = this.application.get('EmployeeModel');
    const employeeDetailModel: Model<EmployeeDetail> = this.application.get('EmployeedetailModel');
    const businessModel: Model<BusinessModel> = this.application.get('BusinessModel');
    const userModel: Model<UserModel> = this.application.get('UserModel');
    const BusinessActiveModel: Model<BusinessActiveModel> = this.application.get('BusinessActiveModel');

    await userModel.create({
      _id: 'dbeb5d9d-e55e-44b2-a29f-dae32f0ff188',
      userAccount: {
        email: 'owner-admin@testdomen.in',
      },
      createdAt: '2019-06-17T11:23:59.000Z',
      businesses: ['af94664f-087f-43f8-97bf-4d2205bedc76'],
    } as any);

    await userModel.create({
      _id: 'dbeb5d9d-e55e-44b2-gggg-gggggggggggg',
      userAccount: {
        email: 'employeeuser5@test.com',
      },
      createdAt: '2019-06-17T11:23:59.000Z',
      businesses: ['88038e2a-90f9-11e9-a492-7200004fe4c0'],
    } as any);

    await BusinessActiveModel.create({
        "_id" : "2fe2f639-3db9-4718-933b-d9b452ed3502",
        "owner" : "dbeb5d9d-e55e-44b2-gggg-gggggggggggg",
        "__v" : 0,
        "businessId" : "88038e2a-90f9-11e9-a492-7200004fe4c0",
        "createdAt" : "2023-06-06T13:40:03.692+0000",
        "updatedAt" : "2023-06-06T13:40:31.788+0000"
    })

    await userModel.create({
      _id: 'dbeb5d9d-e55e-44b2-bbbb-bbbbbbbbbbbb',
      userAccount: {
        email: 'cccccccccccccc@test.com',
      },
      createdAt: '2019-06-17T11:23:59.000Z',
      businesses: ['88038e2a-90f9-11e9-a492-7200004fe4c0'],
    } as any);

    await BusinessActiveModel.create({
        "_id" : "2fe2f639-3db9-4718-933b-d9b452ed3512",
        "owner" : "dbeb5d9d-e55e-44b2-bbbb-bbbbbbbbbbbb",
        "__v" : 0,
        "businessId" : "88038e2a-90f9-11e9-a492-7200004fe4c0",
        "createdAt" : "2023-06-06T13:40:03.692+0000",
        "updatedAt" : "2023-06-06T13:40:31.788+0000"
    })
    

    await businessModel.create({
      _id: 'af94664f-087f-43f8-97bf-4d2205bedc76',
      name: 'test business',
      owner: 'dbeb5d9d-e55e-44b2-a29f-dae32f0ff188'
    });

    await employeeModel.create({
      _id: '8a13bd00-90f1-11e9-9f67-7200004fe4c2',
      firstName: 'test',
      lastName: 'test',
      phone: 'test',
      email: 'email@test.com',
      userId: '8a13bd00-90f1-11e9-9f67-7200004fe4c1',
      positions: [
        {
          businessId: '88038e2a-90f9-11e9-a492-7200004fe4c0',
          status: 1,
          positionType: 'Admin'
        },
        {
          businessId: 'df4c7b7b-c33e-4643-810f-c50420cbeebc',
          status: 1,
          positionType: 'Admin'
        },
        {
          businessId: '8a13bd00-90f1-11e9-9f67-7200004fe4c0',
          status: 1,
          positionType: 'Admin'
        }
      ]
    } as any);

    await employeeModel.create({
      _id: '8a13bd00-90f1-11e9-9f67-7200003fe4c2',
      firstName: 'test',
      lastName: 'test',
      phone: 'test',
      email: 'onlyemployee@test.com',
      positions: [
        {
          businessId: '88038e2a-90f9-11e9-a492-7200004fe4c0',
          status: 1,
          positionType: 'Admin'
        },
        {
          businessId: 'df4c7b7b-c33e-4643-810f-c50420cbeebc',
          status: 1,
          positionType: 'Admin'
        },
        {
          businessId: '8a13bd00-90f1-11e9-9f67-7200004fe4c0',
          status: 1,
          positionType: 'Admin'
        }
      ]
    } as any);

    await employeeModel.create({
      _id: '8a13bd00-90f1-11e9-9f67-bbbbbbbbbbbb',
      firstName: 'test',
      lastName: 'test',
      phone: 'test',
      email: 'bbbbbbbbbbbb@test.com',
      positions: [
        {
          businessId: '88038e2a-90f9-11e9-a492-7200004fe4c0',
          status: 1,
          positionType: 'Admin'
        },
        {
          businessId: 'df4c7b7b-c33e-4643-810f-c50420cbeebc',
          status: 1,
          positionType: 'Admin'
        },
        {
          businessId: '8a13bd00-90f1-11e9-9f67-7200004fe4c0',
          status: 1,
          positionType: 'Admin'
        }
      ]
    } as any);

    await employeeDetailModel.create({
      _id: '8a13bd00-90f1-11e9-dddd-bbbbbbbbbbbb',
      employeeId: '8a13bd00-90f1-11e9-9f67-bbbbbbbbbbbb',
      firstName: 'test',
      lastName: 'test',
      phone: 'test',
      position: {
          businessId: '88038e2a-90f9-11e9-a492-7200004fe4c0',
          status: 1,
          positionType: 'Admin'
        }
    } as any);


    await employeeModel.create({
      _id: '8a13bd00-90f1-11e9-9f67-cccccccccccc',
      firstName: 'test',
      lastName: 'test',
      phone: 'test',
      email: 'cccccccccccccc@test.com',
      positions: [
        {
          businessId: '88038e2a-90f9-11e9-a492-7200004fe4c0',
          status: 1,
          positionType: 'Staff'
        }
      ]
    } as any);

    await employeeDetailModel.create({
      _id: '8a13bd00-90f1-11e9-dddd-cccccccccccc',
      employeeId: '8a13bd00-90f1-11e9-9f67-cccccccccccc',
      firstName: 'test',
      lastName: 'test',
      phone: 'test',
      deleted: false,
      position: {
          businessId: '88038e2a-90f9-11e9-a492-7200004fe4c0',
          status: 1,
          positionType: 'Staff'
        }
    } as any);

    await employeeModel.create({
      _id: '2a13bd00-90f1-11e9-9f67-7200003f86c9',
      firstName: 'test',
      lastName: 'test',
      phone: 'test',
      email: 'empltest@test.com',
      positions: [
        {
          businessId: '88038e2a-90f9-11e9-a492-7200004fe4c0',
          status: 1,
          positionType: 'Staff',
        },
      ],
    } as any);

    await employeeModel.create({
      _id: '8a13bd00-90f1-11e9-9f65-7200003fe4c2',
      firstName: 'test',
      lastName: 'test',
      phone: 'test',
      email: 'employeeuser1@test.com',
      userId: '8a13bd00-90f1-12e9-9f67-7200004fe4c1'
    } as any);

    await employeeModel.create({
      _id: '8a13bd00-30f1-11e9-9f65-7200003fe4c2',
      firstName: 'test',
      lastName: 'test',
      phone: 'test',
      email: 'employeeuser2@test.com',
      userId: '8a13bd00-90f1-12e9-9f67-7200004fe4c2'
    } as any);

    await employeeModel.create({
      _id: '00162dbf-19e0-4cdb-a7e5-61b0bad5883f',
      firstName: 'test firstname',
      lastName: 'test lastname',
      phone: 'test',
      email: 'employeeuser3@test.com'
    } as any);

    await employeeModel.create({
      _id: '00163dbf-19e0-4cdb-a7e5-61b0bad5883f',
      firstName: 'test delete',
      lastName: 'test delete',
      phone: 'test',
      email: 'employeeuser4@test.com',
      positions: [
        {
          businessId: '88038e2a-90f9-11e9-a492-7200004fe4c0',
          status: 1,
          positionType: 'Admin'
        },
      ]
    } as any);

    await employeeModel.create({
      _id: 'bc7d3532-605c-4d07-ba9f-31105466423b',
      firstName: 'test delete emp',
      lastName: 'test delete emp',
      phone: 'test',
      email: 'employeeuser5@test.com',
      positions: [
        {
          businessId: "88038e2a-90f9-11e9-a492-7200004fe4c0",
          status: 1,
          positionType: "Staff"
        }
      ]
    } as any);
  }
}

export = EmployeesFixture;
