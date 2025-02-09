import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FolderDocument, FolderModelService, ScopeEnum, FoldersService } from '@pe/folders-plugin';
import { Model } from 'mongoose';
import { AdminCategoryDto, CategoryQueryDto } from '..';
import { CategoriesFixture } from '../fixture-data';
import { CategoryModel } from '../models';

@Injectable()
export class CategoryService {

  constructor(
    @InjectModel('Category')
    private readonly categoryModel: Model<CategoryModel>,
    private readonly folderModelService: FolderModelService,
    private readonly foldersService: FoldersService,
  ) { }

  public async findAll(): Promise<CategoryModel[]> {
    return this.categoryModel.find();
  }

  public async setupDefaultCategories(): Promise<void> {
    const rootFolder: FolderDocument = await this.foldersService.getDefaultScopeRootFolder();
    for (const category of CategoriesFixture) {
      const foundFolder: FolderDocument = await this.folderModelService.getFolder(category._id);

      if (!foundFolder) {
        await this.folderModelService.create({
            ...category,
            isProtected: true,
            scope: ScopeEnum.Default,

            parentFolderId: rootFolder._id,
          });
      } else {
        await this.folderModelService.findOneAndUpdate(
          { _id: category._id },
          {
            name: category.name,
            position: category.position,
          },
        );
      }
    }
  }

  public async getForAdmin(query: CategoryQueryDto)
    : Promise<{ documents: CategoryModel[]; page: number; total: number }> {

    const limit: number = query.limit || 100;
    const page: number = query.page || 1;
    const sort: any = query.sort || { createdAt: 1 };
    const skip: number = (page - 1) * limit;

    const conditions: any = { };

    const documents: CategoryModel[] = await this.categoryModel
      .find(conditions)
      .select(query.projection)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();

    const total: number = await this.categoryModel.count(conditions);

    return {
      documents,
      page,
      total,
    };
  }

  public async createForAdmin(dto: AdminCategoryDto)
    : Promise<CategoryModel> {
    return this.categoryModel.create(dto);
  }

  public async updateForAdmin(id: string, dto: AdminCategoryDto)
    : Promise<CategoryModel> {
    await this.categoryModel.findByIdAndUpdate(id, dto);
    
    return this.categoryModel.findById(id);
  }

  public async deleteForAdmin(id: string): Promise<void> {
    await this.categoryModel.findByIdAndDelete(id);
  }
}
