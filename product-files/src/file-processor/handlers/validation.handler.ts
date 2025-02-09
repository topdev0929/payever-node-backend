import { PostParseHandlerInterface } from './post-parse-handler.interface';
import { ProductDto } from '../../file-imports/dto/products';
import { FileImportDto } from '../../file-imports/dto';
import { PostParseErrorDto, PostParseHandlerResultDto } from '../dto';
import { validateSync, ValidationError } from 'class-validator';

export class ValidationHandler implements PostParseHandlerInterface {

  public async handle(productDto: ProductDto[], importDto: FileImportDto): Promise<PostParseHandlerResultDto> {
    const validProducts: ProductDto[] = [];
    const errors: ValidationError[][] = [];
    for (const product of productDto) {
      const currentProductErrors: any = validateSync(product);
      if (!currentProductErrors || currentProductErrors.length === 0) {
        validProducts.push(product);
      } else {
        errors.push(currentProductErrors);
      }
    }

    return {
      errors: errors.length > 0
        ? this.prepareErrors(errors.reduce((result: any, currentErrors: any) => [...result, ...currentErrors]))
        : [],
      products: validProducts,
    };
  }

  private prepareErrors(errors: ValidationError[]): PostParseErrorDto[] {
    const errorsMap: Map<string, string[]> = new Map();
    for (const error of errors) {
      const messages: string[] = this.getValidationErrorMessages(error);
      const productIdentifier: any = this.getProductIdentityFromError(error) || 'SKU_IS_NOT_SET';
      const productErrors: any = errorsMap.has(productIdentifier) ? errorsMap.get(productIdentifier) : [];

      messages.forEach((message: string) => productErrors.push(message));

      errorsMap.set(productIdentifier, productErrors);
    }

    const preparedErrorsMessages: PostParseErrorDto[] = [];
    for (const [sku, errorsList] of errorsMap) {
      const skuErrors: any = {
        messages: errorsList,
        sku: sku,
      };

      preparedErrorsMessages.push(skuErrors);
    }

    return preparedErrorsMessages;
  }

  private getValidationErrorMessages(error: ValidationError): string[] {
    const messages: string[] = [];
    if (error.constraints) {
      for (const message of Object.values(error.constraints)) {
        messages.push(message);
      }
    } else if (error.children) {
      for (const child of error.children) {
        const childSku: string = this.getProductIdentityFromError(child);
        for ( const message of this.getValidationErrorMessages(child)) {
          messages.push(childSku ? `SKU "${childSku}": ${message}` : message);
        }
      }
    }

    return messages;
  }

  private getProductIdentityFromError(error: ValidationError): string {
    const skuFieldName: string = 'sku';

    return  error.target.hasOwnProperty(skuFieldName)
      ? error.target[skuFieldName]
      : undefined;
  }
}
