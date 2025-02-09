import { Body, Controller, Get, HttpStatus, Patch, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InternalBasicAuthGuard } from '@pe/nest-kit';
import { Model } from 'mongoose';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { environment } from '../../environments/environment';

import { UpdateDto } from '../dto/update.dto';
import { MobileAppInterface } from '../interfaces/mobile-app.interface';
import { MobileAppSchemaName } from '../schemas/mobile-app.schema';

@Controller('mobile-settings')
@ApiTags('mobile-settings')
export class MobileAppController {
  constructor(@InjectModel(MobileAppSchemaName) private readonly mobileAppsModel: Model<MobileAppInterface>) { }

  @Get()
  public async get(): Promise<MobileAppInterface> {
    return this.mobileAppsModel.findOne();
  }

  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @UseGuards(new InternalBasicAuthGuard(environment.internalBasicAuthLogin, environment.internalBasicAuthPassword))
  @Patch()
  public async patch(@Body() dto: UpdateDto): Promise<MobileAppInterface> {
    return this.mobileAppsModel.findOneAndUpdate({ }, { $set: dto }, { new: true });
  }
}
