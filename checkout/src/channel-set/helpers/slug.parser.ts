import { BadRequestException } from '@nestjs/common';
import { ParsedSlug } from '../interfaces';

const SLUG_CHECKOUT: RegExp = /^[\w\d\-]+\/[\w\d\-]+\/[\w\d\-]+$/;
const SLUG_SHIPPING: RegExp = /^(.+)\/shipping$/;
const SLUG_FINEXP: RegExp = /^\d+\/[\w\d-]+$/;

export class SlugParser {
  public static parse(slug: string): ParsedSlug {
    let parsedSlug: string[] = slug.match(SLUG_FINEXP);
    if (parsedSlug && parsedSlug.length) {
      return { type: 'finance_express', slug: parsedSlug[0] };
    }

    parsedSlug = slug.match(SLUG_SHIPPING);
    if (parsedSlug && parsedSlug.length) {
      return { type: 'checkout', slug: parsedSlug[1] };
    }

    parsedSlug = slug.match(SLUG_CHECKOUT);
    if (parsedSlug && parsedSlug.length) {
      return { type: 'checkout', slug };
    }

    throw new BadRequestException(`Unable to parse checkout slug ${slug}`);
  }
}
