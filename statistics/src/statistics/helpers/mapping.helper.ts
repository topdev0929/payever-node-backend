import { MappedFolderItemInterface } from '@pe/folders-plugin';
import { DashboardModel } from '../models';

export class MappingHelper {
  public static map(
    data: DashboardModel,
  ): MappedFolderItemInterface {
    return {
      _id: data._id,
      serviceEntityId: data._id,
      title: data.name,
      ...data.toObject(),

      applicationId: data._id,
      userId: null,
    };
  }
}
