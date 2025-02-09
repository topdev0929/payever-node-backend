import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';
import { GenerateRandomVideoDto, GenerateVideoByTagDto } from '../dto';
import { VideoGeneratorTaskTypeEnum } from '../enums';
import { VideoGeneratorTaskService } from '../services';
import { VideoGeneratorTaskModel } from '../models';
import { Acl, AclActionsEnum } from '@pe/nest-kit';

// todo: wait nima wrapper to moved to other pod, commented because test failed
// @Controller(':businessId/video')
// @UseGuards(JwtAuthGuard)
// @Roles(RolesEnum.merchant)
// @ApiTags('Video Generator API')
export class RandomVideoGeneratorController {
  // constructor(
  //   private readonly taskService: VideoGeneratorTaskService,
  // ) { }
  //
  // @Post('/generate/random')
  // @Acl({ microservice: 'studio', action: AclActionsEnum.create })
  // public async generateRandom(
  //   @Param('businessId') businessId: string,
  //   @Body() body: GenerateRandomVideoDto,
  // ): Promise<VideoGeneratorTaskModel> {
  //   return this.taskService.create(
  //     {
  //       body: body,
  //       businessId: businessId,
  //     },
  //     VideoGeneratorTaskTypeEnum.generateRandomVideo,
  //   );
  // }
  //
  // @Post('/generate/tag')
  // @Acl({ microservice: 'studio', action: AclActionsEnum.create })
  // public async generateByTag(
  //   @Param('businessId') businessId: string,
  //   @Body() body: GenerateVideoByTagDto,
  // ): Promise<VideoGeneratorTaskModel> {
  //   return this.taskService.create(
  //     {
  //       body: body,
  //       businessId: businessId,
  //     },
  //     VideoGeneratorTaskTypeEnum.generateVideoByTag,
  //   );
  // }
}
