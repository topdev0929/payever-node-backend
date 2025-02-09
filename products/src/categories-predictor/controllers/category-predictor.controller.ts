import { Controller, UseGuards, Get, Query } from '@nestjs/common';
import { Acl, AclActionsEnum, JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit';
import { PredictCategoryInputDto } from '../dto';
import { CategoriesPredictorService } from '../services';

@Controller('/business/:businessId/categories')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
export class CategoryPredictorController {
  constructor( 
    private readonly categoriesPredictorService: CategoriesPredictorService,
  ) { }

  @Get('/predict')
  @Acl({ microservice: 'products', action: AclActionsEnum.create })
  public async predictCategory(
    @Query() input: PredictCategoryInputDto,
  ): Promise<string[]> {
    return this.categoriesPredictorService.predict(input);
  }
}
