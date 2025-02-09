import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as querystring from 'querystring';
import { environment } from '../../environments';
import { ChannelSetSlugSchemaName } from '../../mongoose-schema';
import { ParsedSlug } from '../interfaces';
import { ChannelSetSlugModel } from '../models';

const CHECKOUT_URL_TEMPLATE: string = `${environment.frontendCheckoutWrapperMicroUrl}/pay/create-flow/channel-set-id/`;
const FINANCE_EXPRESS_URL_TEMPLATE: string = `${environment.finexpMicroUrl}/api/redirect/`;

@Injectable()
export class RedirectUrlGenerator {
  constructor(
    @InjectModel(ChannelSetSlugSchemaName) private readonly channelSetSlugModel: Model<ChannelSetSlugModel>,
  ) { }

  public async generate(
    parsedSlug: ParsedSlug,
    query: { [key: string]: string },
  ): Promise<string | never> {
    if (parsedSlug.type === 'checkout') {
      const channelSetId: string = await this.getChannelSetId(parsedSlug.slug);

      return CHECKOUT_URL_TEMPLATE + channelSetId;
    }

    return FINANCE_EXPRESS_URL_TEMPLATE + parsedSlug.slug + '?' + querystring.stringify(query);
  }

  private async getChannelSetId(slug: string): Promise<string | never> {
    const slugMap: ChannelSetSlugModel = await this.channelSetSlugModel.findOne({ slug });
    if (!slugMap) {
      throw new NotFoundException(`ChannelSet with slug ${slug} does not exist`);
    }

    slugMap.lastUse = new Date();
    slugMap.used = slugMap.used
      ? ++slugMap.used
      : 1
    ;

    await slugMap.save();

    return slugMap.id;
  }
}
