import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ParamModel } from '@pe/nest-kit/modules/nest-decorator/param-model';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';
import { GetSceneInfoDto, UpdateSceneInfoDto } from '../dto';
import { SceneInfoModel } from '../models';
import { SceneInfoService } from '../services';
import { SceneInfoSchemaName } from '../schemas';

// todo: wait nima wrapper to moved to other pod, commented because test failed
// @Controller('scene')
// @UseGuards(JwtAuthGuard)
// @Roles(RolesEnum.admin)
// @ApiTags('Scene Info API')
export class SceneInfoController {
  // constructor(
  //   private readonly sceneInfoService: SceneInfoService,
  // ) { }
  //
  // @Get('/video')
  // public async findByVideo(
  //   @Query() sceneInfoByVideo: GetSceneInfoDto,
  // ): Promise<SceneInfoModel[]> {
  //   return this.sceneInfoService.findByVideo(sceneInfoByVideo);
  // }
  //
  // @Get('/:sceneInfoId')
  // public async findById(
  //   @ParamModel(':sceneInfoId', SceneInfoSchemaName) data: SceneInfoModel,
  // ): Promise<SceneInfoModel> {
  //   return data;
  // }
  //
  // @Delete('/:sceneInfoId')
  // public async removeById(
  //   @ParamModel(':sceneInfoId', SceneInfoSchemaName) data: SceneInfoModel,
  // ): Promise<void> {
  //   await this.sceneInfoService.remove(data);
  // }
  //
  // @Post('/:sceneInfoId')
  // public async update(
  //   @Param('sceneInfoId') sceneInfoId: string,
  //   @Body() body: UpdateSceneInfoDto,
  // ): Promise<SceneInfoModel> {
  //   return this.sceneInfoService.update(sceneInfoId, body);
  // }
}
