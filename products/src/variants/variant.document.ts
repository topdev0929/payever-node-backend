import { ProductBaseDocument } from '../new-products/documents/product-base.document';
import { VariantInterface } from './interfaces/variant.interface';

export interface VariantDocument extends VariantInterface, ProductBaseDocument { }
