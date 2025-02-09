import { Controller, Inject, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles, RolesEnum, JwtAuthGuard, AbstractController, User, UserTokenInterface } from '@pe/nest-kit';
import { FolderDocument, FoldersService, FolderTreeItemInterface, ScopeEnum } from '@pe/folders-plugin';
import { BusinessLocal, UserDocument, UsersService } from '../../projections';
import { BusinessModel, BusinessService } from '@pe/business-kit';

@Controller(`message-folders`)
@ApiTags('Folders (Message Service)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
export class MessageFoldersController extends AbstractController {
  @Inject() private readonly foldersService: FoldersService;
  @Inject() private readonly usersService: UsersService;
  @Inject() private readonly businessService: BusinessService;

  @Get('tree-all')
  public async getTreeStructureForAllAvailableFolders(
    @User() userToken: UserTokenInterface,
  ): Promise<FolderTreeItemInterface[]> {
    const userId: string = userToken.id;
    const user: UserDocument = await this.usersService.findById(userId);
    const rootFolderForUser: FolderDocument = await this.foldersService.getUserScopeRootFolder(userId);

    const tree: FolderTreeItemInterface[] = [
      {
        _id: rootFolderForUser?._id,
        children: await this.foldersService.getRootTree(null, userId),
        isFolder: true,
        name: 'Personal',
        parentFolderId: null,
        position: rootFolderForUser?.position,
        scope: ScopeEnum.User,
      },
    ];

    const allBusiness: BusinessModel[] = await this.businessService.findAll({ _id: { $in: user.businesses } });

    for (const businessId of user.businesses) {
      const business: BusinessLocal = allBusiness.find((b: BusinessModel) => b._id === businessId) as any;

      if (!business || !business.hasMessageApp) {
        continue;
      }

      const rootFolderForBusiness: FolderDocument = await this.foldersService.getBusinessScopeRootFolder(businessId);
      const children: FolderTreeItemInterface[] = (await this.foldersService.getRootTree(businessId)) || [];

      tree.push(
        {
          _id: rootFolderForBusiness?._id,
          children,
          isFolder: true,
          name: business.name,
          parentFolderId: null,
          position: rootFolderForBusiness?.position,
          scope: ScopeEnum.Business,
        },
      );
    }

    return tree;
  }
}
