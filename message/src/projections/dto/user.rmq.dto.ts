/**
 * @ref nodejs-backend/users/src/user/models/user.model.ts
 */
export interface UserRmqDto {
  _id: string;
  businesses: BusinessRmqDto[];
  userAccount: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    createdAt: string;
    logo: string;
  };
  createdAt: Date;
}

export interface BusinessRmqDto {
  _id: string;
}
