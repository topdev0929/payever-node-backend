import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { environment } from '../../environments';
import { BusinessSlugModel } from '../models';
import { BusinessSlugSchemaName } from '../schemas';

@Injectable()
export class SlugRedirectInterceptor implements NestInterceptor {

  constructor(
    @InjectModel(BusinessSlugSchemaName) private readonly businessSlugModel: Model<BusinessSlugModel>,
  ) { }

  public async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<any> {
    const request: any = context.switchToHttp().getRequest();
    const response: any = context.switchToHttp().getResponse();

    const slugString: string = request.params.businessSlug;
    const slugMap: BusinessSlugModel = await this.businessSlugModel.findOne({ slug: slugString }).exec();

    if (slugMap) {
      response.redirect(
        `${environment.commerceOsUrl}/business/${slugMap.id}/info/overview`,
      );
    }

    return next.handle();
  }
}
