import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SignupsDto } from './signups.dto';
import { SignupsService } from './signups.service';
import { InternalBasicAuthGuard } from '@pe/nest-kit';
import { environment } from '../environment/environment';

@ApiTags('signups')
@Controller('signups')
@UseGuards(new InternalBasicAuthGuard(environment.applicationApiKey, ''))
export class SignupsController {
  constructor(
    private readonly signupsService: SignupsService,
  ) { }
}
