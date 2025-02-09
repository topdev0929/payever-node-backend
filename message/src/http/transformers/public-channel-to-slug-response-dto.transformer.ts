import { CommonChannelDocument } from '../../message/submodules/messaging/common-channels';
import { PublicChannelSlugDto } from '../dto';

export function publicChannelToSlugResponseDtoTransformer(
  publicChannel: CommonChannelDocument,
): PublicChannelSlugDto {
  return {
    _id: publicChannel._id,
    photo: publicChannel.photo,
    slug: publicChannel.slug,
    title: publicChannel.title,
  };
}
