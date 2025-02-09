import { ProductDto } from '../../file-imports/dto/products';
import { PostParseErrorDto } from './post-parse-error.dto';

export class PostParseHandlerResultDto {
  public products: ProductDto[];
  public errors: PostParseErrorDto[];
}
