import { UserDocumentSchema as UserModel } from '../schemas'; 

export async function userToUserDtoTransformer(user: UserModel): Promise<any> {

  return {
    ...user.toObject(),
  };
}
