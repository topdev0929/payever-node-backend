import { Exclude, Expose } from 'class-transformer';
import { IsNumber, IsString, IsDefined, IsEmail, IsNotEmpty } from 'class-validator';

@Exclude()
export class InviteTokenDto {
  @IsString()
  @IsDefined()
  @Expose()
  @IsNotEmpty()
  public id: string;

  @IsString()
  @IsDefined()
  @Expose()
  @IsNotEmpty()
  public businessId: string;

  @IsString()
  @IsDefined()
  @IsEmail()
  @Expose()
  @IsNotEmpty()
  public email: string;

  @IsNumber()
  @IsDefined()
  @Expose()
  @IsNotEmpty()
  public iat: number;

  @IsNumber()
  @IsDefined()
  @Expose()
  @IsNotEmpty()
  public exp: number;
}
