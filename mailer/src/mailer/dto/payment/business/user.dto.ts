import { Allow, IsString, IsOptional } from 'class-validator';
import { Expose } from 'class-transformer';

export class UserDto {
  @IsString()
  @IsOptional()
  public first_name: string;

  @IsString()
  @IsOptional()
  public last_name: string;

  @IsString()
  @IsOptional()
  public email: string;

  @Allow()
  @Expose()
  public getFullName(): string {
    const fullName: string = [this.first_name, this.last_name].filter((value: string): boolean => !!value).join(' ');
    if (!!fullName) {
      return fullName;
    }

    return this.email;
  }
}
