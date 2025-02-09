import { launchConsumer } from '@pe/nest-kit';
import { ApplicationModule } from './app.module';
import { RabbitChannelsEnum } from './sites/enums';

launchConsumer(ApplicationModule, [
  RabbitChannelsEnum.Site,
  RabbitChannelsEnum.Rpc,
]);
