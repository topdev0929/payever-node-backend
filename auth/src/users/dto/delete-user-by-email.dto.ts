import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class DeleteUserByEmailDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail(undefined, {
    message: 'forms.error.validator.email.invalid',
  })
  public email: string;
}
