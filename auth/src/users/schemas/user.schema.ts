import { Schema, SchemaType, Document } from 'mongoose';
import * as uniqueValidator from 'mongoose-unique-validator';
import { v4 as uuid } from 'uuid';
import { RolesEnum, UserRoleInterface, UserRoleTypes } from '@pe/nest-kit';

import { UserRoleSchema } from './user-role.schema';
import { User } from '../interfaces';
import { PartnerRoleSchema } from '../../partners/schemas';
import { CustomerRoleSchema } from '../../customers/schemas';

export const UserSchemaName: string = 'User';

export const UserSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    email: { type: String, required: true },
    firstName: String,
    lastName: String,
    password: { type: String },
    roles: [UserRoleSchema],
    salt: { type: String },

    generalAccount: Boolean,
    ipAddress: String,
    isActive: Boolean,
    isRevoked: Boolean,
    isVerified: Boolean,
    language: String,
    logo: String,
    resetPasswordExpires: Date,
    resetPasswordToken: String,
    revokeAccountDateAt: Date,
    secondFactorRequired: Boolean,
    unverifiedPeriodExpires: Date,
  },
  {
    collection: 'users',
    timestamps: true,
    toJSON: {
      getters: true,
      transform(doc: object, ret: User): object {
        delete ret.password;
        delete ret.salt;

        return ret;
      },
    },
    toObject: { getters: true },
  },
)
  .index({ isActive: 1, email: 1 })
  .index({ email: 1 }, { unique: true })
  .index({ resetPasswordExpires: 1 })
  .plugin(uniqueValidator, { message: 'forms.error.validator.{PATH}.not_unique' });

UserSchema.method('getRole', function (this: User, roleName: RolesEnum): UserRoleTypes | undefined {
  return this?.roles?.find((role: UserRoleInterface) => role?.name === roleName);
});

UserSchema.method('isAdmin', function (this: User): boolean {
  return !!this?.roles?.find((role: UserRoleInterface) => role?.name === RolesEnum.admin);
});

const isDocumentArray: (schemaType: SchemaType) => schemaType is Schema.Types.DocumentArray
  = (schemaType: SchemaType): schemaType is Schema.Types.DocumentArray => {
    return schemaType instanceof Schema.Types.DocumentArray;
  };

const rolesArray: SchemaType = UserSchema.path('roles');
if (isDocumentArray(rolesArray)) {
  rolesArray.discriminator(RolesEnum.partner, PartnerRoleSchema);
  rolesArray.discriminator(RolesEnum.customer, CustomerRoleSchema);
}

export interface UserDocumentSchema extends User, Document<string> {
  _id?: string;
  id: string;

  readonly createdAt: Date;
}
