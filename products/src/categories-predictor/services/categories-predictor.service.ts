import { Injectable, Logger , HttpService } from '@nestjs/common';
import { PredictCategoryInputDto } from '../dto';
import { environment } from '../../environments';
@Injectable()
export class CategoriesPredictorService {

  constructor(
    private readonly httpsService: HttpService,
    private readonly logger: Logger,
  ) { }

  public async predict(input: PredictCategoryInputDto): Promise<any> {
    try {
      const titleQueryParam = encodeURIComponent(input.title);
      const url: string = `${environment.categoryPredictUrl}/api/predict_category?title=${titleQueryParam}`;
      const result = await this.httpsService.get(url).toPromise();

      return result.data;
    } catch (err) {
      this.logger.error('[CategoriesPredictorService] Error in prediction', err.message, err.stack);
      
      return [];
    }
  }
}


