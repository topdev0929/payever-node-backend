import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { SlugRedirectInterceptor } from '../interceptors/slug-redirect.interceptor';
import { BusinessSlugModel } from '../models';
import { BusinessSlugSchemaName } from '../schemas';

@ApiTags('slug/business')
@Controller('slug/business')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Roles(RolesEnum.anonymous)
export class SlugController {

  @Get(':businessSlug/home')
  @UseInterceptors(SlugRedirectInterceptor)
  public async redirectSlugChannelSet(
    @ParamModel({ slug: 'businessSlug' }, BusinessSlugSchemaName) slugMap: BusinessSlugModel,
  ): Promise<void> {
    slugMap.lastUse = new Date();
    slugMap.used = slugMap.used
      ? ++slugMap.used
      : 1
    ;

    await slugMap.save();
  }
}
