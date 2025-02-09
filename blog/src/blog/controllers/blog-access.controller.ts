import { Body, Controller, Patch, UseGuards } from '@nestjs/common';
import {
  AbstractController,
  Acl,
  AclActionsEnum,
  JwtAuthGuard,
  ParamModel,
  Roles,
  RolesEnum,
  User,
  UserTokenInterface,
} from '@pe/nest-kit';
import { UpdateAccessConfigDto } from '../dto';
import { BlogEditVoter } from '../voters';
import { BlogSchemaName } from '../../mongoose-schema/mongoose-schema.names';
import { BlogAccessConfigModel, BlogModel } from '../models';
import { BlogAccessConfigService } from '../services';

@Controller('business/:businessId/blog/access')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
export class BlogAccessController extends AbstractController {
  constructor(
    private readonly blogAccessConfigsService: BlogAccessConfigService,
  ) {
    super();
  }

  @Patch(':blogId')
  @Acl({ microservice: 'blog', action: AclActionsEnum.update })
  public async updateAccessConfig(
    @User() user: UserTokenInterface,
    @ParamModel(':blogId', BlogSchemaName, true) blog: BlogModel,
    @Body() dto: UpdateAccessConfigDto,
  ): Promise<BlogAccessConfigModel> {
    await this.denyAccessUnlessGranted(BlogEditVoter.EDIT, blog.business, user);

    return this.blogAccessConfigsService.createOrUpdate(blog, dto);
  }
}
