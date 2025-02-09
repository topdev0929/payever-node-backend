import { UserModel, BusinessModel } from '../models';

export async function userToUserDtoTransformer(user: UserModel): Promise<any> {
  await user.populate('businessDocuments').execPopulate();

  return {
    ...user.toObject(),
    businessDocuments: undefined,
    businesses: user.businessDocuments?.map((doc: BusinessModel) => doc.toObject()),
  };
}
