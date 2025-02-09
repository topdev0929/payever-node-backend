import { ProductDto } from '../../file-imports/dto/products';
import { FileImportDto } from '../../file-imports/dto';
import { PostParseHandlerResultDto } from '../dto';

export interface PostParseHandlerInterface {
  handle(productDto: ProductDto[], importDto: FileImportDto): Promise<PostParseHandlerResultDto>;
}
