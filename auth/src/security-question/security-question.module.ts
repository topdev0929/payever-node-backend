import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SecurityQuestionController } from './controllers';
import { SecurityQuestionSchema, SecurityQuestionSchemaName } from './schemas';
import { SecurityQuestionService } from './services';
import { AuthModule } from '../auth';
import { UserModule } from '../users';
import { TokenCookieWriter } from '../common';
import { LoginListener } from './event-listeners';

@Module({
  controllers: [SecurityQuestionController],
  exports: [SecurityQuestionService],
  imports: [
    forwardRef(() => AuthModule),
    MongooseModule.forFeature([
      {
        name: SecurityQuestionSchemaName,
        schema: SecurityQuestionSchema,
      },
    ]),
  ],
  providers: [SecurityQuestionService, TokenCookieWriter, LoginListener],
})
export class SecurityQuestionModule {
}
