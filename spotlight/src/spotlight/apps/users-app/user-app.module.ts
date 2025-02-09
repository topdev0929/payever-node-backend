import { Module, forwardRef } from '@nestjs/common';
import { SpotlightModule } from '../../spotlight.module';
import { UserMessagesConsumer, EmployeesMessagesConsumer } from './consumers';

@Module({
  controllers: [
    UserMessagesConsumer,
    EmployeesMessagesConsumer,
  ],
  imports: [
    forwardRef(() => SpotlightModule),
  ],
  providers: [
  ],
})

export class UserAppModule { }

