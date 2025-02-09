/**
 * @see auth/src/users/dto/register.dto.ts
 */
export interface AuthRegisterPayloadInterface {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  forceGeneratePassword: boolean;
}
