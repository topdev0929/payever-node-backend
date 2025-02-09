import { AclInterface } from '@pe/nest-kit';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class AclDto implements AclInterface {
  @IsNotEmpty()
  @IsString()
  public microservice: string;

  @IsNotEmpty()
  @IsBoolean()
  public create?: boolean;

  @IsNotEmpty()
  @IsBoolean()
  public read?: boolean;

  @IsNotEmpty()
  @IsBoolean()
  public update?: boolean;

  @IsNotEmpty()
  @IsBoolean()
  public delete?: boolean;
}
