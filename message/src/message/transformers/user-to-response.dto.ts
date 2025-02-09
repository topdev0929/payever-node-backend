import { UserInterface } from '../../projections/schema';
import { UserHttpResponseDto } from '../dto/outgoing';

export function userToResponseDto(user: UserInterface & { _id: string }): UserHttpResponseDto {
  return {
    _id: user?._id,
    userAccount: user?.userAccount,
  };
}
