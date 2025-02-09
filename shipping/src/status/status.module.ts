import { HttpModule, Module } from '@nestjs/common';
import { StatusHttpController } from './controllers/status-http.controller';

@Module({
  controllers: [
    StatusHttpController,
  ],
  imports: [
    HttpModule,
  ],
  providers: [],
})
export class StatusModule { }
