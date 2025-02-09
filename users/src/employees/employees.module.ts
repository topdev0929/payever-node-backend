import { MiddlewareConsumer, Module, NestModule, forwardRef, HttpModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { FoldersPluginModule } from '@pe/folders-plugin';
import { RuleActionEnum, RulesSdkModule } from '@pe/rules-sdk';
import { ExportEmployeesCommand, SyncEmployeeNamesCommand } from './commands';
import { EmployeeConsumer, GroupsConsumer, MailerConsumer, ReportConsumer } from './consumers';
import {
  AdminController,
  AdminEmployeesController,
  AllEmployeesController,
  EmployeeController,
  GroupsController,
  ReportController,
} from './controllers';
import { RabbitChannelsEnum, RabbitExchangesEnum } from './enum';
import { EventsProducer } from './producer/event.producer';
import {
  BulkImport,
  BulkImportSchema,
  EmployeeSchema,
  EmployeeSchemaName,
  GroupsSchema,
  GroupsSchemaName,
  Report,
  ReportSchema,
  Task,
  TaskSchema,
  UserSchema,
  UserSchemaName,
} from './schemas';
import { EmployeeService, InvitationService, GroupsService, BulkImportService, ReportService, TaskService } from './services';
import { CustomAccessModule } from '../custom-access/custom-access.module';
import { environment } from '../environments';
import { UserModule } from '../user/user.module';
import { ReportDetail, ReportDetailSchema } from './schemas/report-details.schema';
import { ReportDetailService } from './services/report-detail.service';

import {
  AfterDateFilter,
  BeforeDatesFilter,
  BetweenDatesFilter,
  BetweenFilter,
  ContainsFilter,
  DoesNotContainFilter,
  EndsWithFilter,
  IsDateFilter,
  IsFilter,
  IsInFilter,
  IsNotDateFilter,
  IsNotFilter,
  IsNotInFilter,
  LessThanFilter,
  StartsWithFilter,
  FilterCollector,
} from './helper/filter';
import { EmployeeDetailSchema, EmployeeDetailSchemaName } from './schemas/employee-detail.schema';

@Module({
  controllers: [
    AdminEmployeesController,
    AdminController,
    AllEmployeesController,
    EmployeeController,
    ReportController,
    GroupsController,
    EmployeeConsumer,
    GroupsConsumer,
    ReportConsumer,
    MailerConsumer,
  ],
  exports: [ EmployeeService ],
  imports: [
    HttpModule,
    FoldersPluginModule.forFeature({
      combinedList: false,
      documentSchema: {
        schema: GroupsSchema,
        schemaName: GroupsSchemaName,
      },
      elastic: {
        env: environment.elasticEnv,
        index: {
          businessIdField: 'businessId',
          documentIdField: '_id',
          elasticIndex: `employee-folder`,
          type: `employee-folder`,
        },
        mappingFields: {
          companyName: {
            fielddata: true,
            type: 'text',
          },
          email: {
            fielddata: true,
            type: 'text',
          },
          firstName: {
            fielddata: true,
            type: 'text',
          },
          isActive: {
            type: 'boolean',
          },
          isVerified: {
            type: 'boolean',
          },
          lastName: {
            fielddata: true,
            type: 'text',
          },
          phoneNumber: {
            fielddata: true,
            type: 'text',
          },
          positions: {
            fielddata: true,
            type: 'text',
          },
          userId: {
            fielddata: true,
            type: 'text',
          },
        },
        searchFields: [
          'companyName^1',
          'firstName^1',
          '_id^1',
          'email^1',
          'isActive^1',
          'businessId^1',
          'isVerified^1',
          'lastName^1',
          'phoneNumber^1',
          'positions^1',
          'userId^1',
        ],
        storeFields: [
          'companyName',
          'firstName',
          '_id',
          'email',
          'isActive',
          'businessId',
          'isVerified',
          'lastName',
          'phoneNumber',
          'positions',
          'userId',
        ],
      },
      filters: [],
      microservice: 'commerceos',
      rabbitConfig: {
        documentConsumer: {
          exchange: environment.rabbitExchangeFolder,
          rabbitChannel: environment.rabbitChannelFolder,
        },
        exportConsumer: {
          exchange: environment.rabbitExchangeFolderExport,
          rabbitChannel: environment.rabbitChannelFolderExport,
        },
      },
      redisConfig: environment.redis,
      useBusiness: true,
    }),
    RulesSdkModule.forRoot({
      actions: [
        RuleActionEnum.copy,
        RuleActionEnum.move,
      ],
      fields: [
      ],
      microservice: 'user',
      rabbitConfig: {
        channel: RabbitChannelsEnum.EmployeesFolders,
        exchange: RabbitExchangesEnum.employeesFolders,
      },
      useBusiness: true,
    }),
    MongooseModule.forFeature([
      {
        name: EmployeeDetailSchemaName,
        schema: EmployeeDetailSchema,
      },
      {
        name: EmployeeSchemaName,
        schema: EmployeeSchema,
      },
      {
        name: GroupsSchemaName,
        schema: GroupsSchema,
      },
      {
        name: UserSchemaName,
        schema: UserSchema,
      },
      {
        name: Task.name,
        schema: TaskSchema,
      },
      {
        name: BulkImport.name,
        schema: BulkImportSchema,
      },
      {
        name: Report.name,
        schema: ReportSchema,
      },
      {
        name: ReportDetail.name,
        schema: ReportDetailSchema,
      },
    ]),
    CustomAccessModule,
    forwardRef(() => UserModule),
  ],
  providers: [
    EmployeeService,
    GroupsService,
    InvitationService,
    EventsProducer,
    ExportEmployeesCommand,
    SyncEmployeeNamesCommand,
    BulkImportService,
    ReportService,
    ReportDetailService,
    TaskService,
    AfterDateFilter,
    BeforeDatesFilter,
    BetweenDatesFilter,
    BetweenFilter,
    ContainsFilter,
    DoesNotContainFilter,
    EndsWithFilter,
    IsDateFilter,
    IsFilter,
    IsInFilter,
    IsNotDateFilter,
    IsNotFilter,
    IsNotInFilter,
    LessThanFilter,
    StartsWithFilter,
    FilterCollector,
  ],
})
export class EmployeesModule implements NestModule {
  public configure(): MiddlewareConsumer | void { }
}
