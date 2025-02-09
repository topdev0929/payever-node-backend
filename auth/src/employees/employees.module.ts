import { forwardRef, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth';
import { RmqSender } from '../common';
import { EmployeeController, InviteController } from './controllers';
import { EmployeeFormattingInterceptor } from './interceptors';
import { EmployeeService, GroupsService, InvitationService } from './services';
import { UserModule } from '../users';
import { InivtationEventsProducer } from './producer/invitation.producer';
import { EmployeeMessageProducer, EventsProducer } from './producer';
import { EmployeeConsumer, GroupsConsumer } from './consumers';
import { FixTrustedDomainEmployeesPermissionCommand, MigrateEmployeesCommand } from './commands';
import { EventDispatcherModule } from '@pe/nest-kit';
import { EmployeeSettingsService } from './services/employee-settings.service';
import { BlockEmailModule } from '../blocked-email/block-email.module';
import { MongooseSchemas } from './config';


@Module({
  controllers: [EmployeeConsumer, EmployeeController, GroupsConsumer, InviteController],
  exports: [ 
    EmployeeService,
    InvitationService,
    MongooseModule.forFeature(MongooseSchemas),
  ],
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
    EventDispatcherModule,
    MongooseModule.forFeature(MongooseSchemas),
    forwardRef(() => BlockEmailModule),
  ],
  providers: [
    EmployeeSettingsService,
    InvitationService,
    EmployeeService,
    RmqSender,
    EmployeeFormattingInterceptor,
    GroupsService,
    InivtationEventsProducer,
    EventsProducer,
    MigrateEmployeesCommand,
    FixTrustedDomainEmployeesPermissionCommand,
    EmployeeMessageProducer,
  ],
})
export class EmployeesModule implements NestModule {
  public configure(): MiddlewareConsumer | void { }
}
