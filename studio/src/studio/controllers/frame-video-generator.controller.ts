import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';
import { GenerateVideoFramesDto } from '../dto';
import { VideoGeneratorTaskTypeEnum } from '../enums';
import { VideoGeneratorTaskService } from '../services';
import { VideoGeneratorTaskModel } from '../models';


// todo: wait nima wrapper to moved to other pod, commented because test failed
// @Controller('video')
// @UseGuards(JwtAuthGuard)
// @Roles(RolesEnum.admin)
// @ApiTags('Video Generator API')
export class FrameVideoGeneratorController {
  // constructor(
  //   private readonly taskService: VideoGeneratorTaskService,
  // ) { }
  //
  // @Post('/generate/frames')
  // public async generateFrames(
  //   @Body() body: GenerateVideoFramesDto,
  // ): Promise<VideoGeneratorTaskModel> {
  //   return this.taskService.create(body, VideoGeneratorTaskTypeEnum.generateFrames);
  // }
}
