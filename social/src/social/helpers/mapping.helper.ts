import { PostModel } from '../models';

export class MappingHelper {
  public static async map(
    data: PostModel, 
    options: { omitParentFolderId: boolean } = { omitParentFolderId: false }, 
    populate: boolean = true,
  ): Promise<any> {
    if (populate) {
      await data.populate('channelSet').execPopulate();
    }
    
    const sortDate: Date = (data.status === 'postnow' ? data.postedAt :
      data.status === 'schedule' ? data.toBePostedAt :
        data.status === 'draft' ? data.toBePostedAt || data.updatedAt : null) || data.createdAt;

    return {
      _id: data._id,
      attachments: data.attachments,
      businessId: data.businessId,
      channelSet: (data.channelSet as any[])?.filter((channel: any) => !!channel) || [],
      content: data.content,
      media: data.media,
      postedAt: data.postedAt,
      sentStatus: data.sentStatus,
      serviceEntityId: data._id,
      status: data.status,
      title: data.title,
      toBePostedAt: data.toBePostedAt,
      type: data.type,
      updatedAt: data.updatedAt,
      createdAt: data.createdAt,
      ...(
        options?.omitParentFolderId ? {} : { parentFolderId: data.parentFolderId || null }
      ),
      sortDate,
    };
  }
}
