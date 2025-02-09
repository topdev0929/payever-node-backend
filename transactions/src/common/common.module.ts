import { Module } from '@nestjs/common';
import { OauthService } from './services';

@Module({
  controllers: [
  ],
  exports: [
    OauthService,
  ],
  imports: [
  ],
  providers: [
    OauthService,
  ],
})
export class CommonModule { }
