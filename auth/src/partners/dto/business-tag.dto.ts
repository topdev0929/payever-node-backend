import { IsNotEmpty, IsUUID, IsEnum } from 'class-validator';
import { PartnerTagName } from '@pe/nest-kit';

export class BusinessTagDto {
  @IsNotEmpty()
  @IsUUID()
  public businessId: string;

  @IsNotEmpty()
  @IsEnum(PartnerTagName)
  public tagName: PartnerTagName;
}
