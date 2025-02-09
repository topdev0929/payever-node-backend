import { IsNotEmpty, IsString } from 'class-validator';
import { BuilderPaginationDto } from '../../../../studio/dto';

export class ListAlbumsByAttribute {
  @IsString()
  @IsNotEmpty()
  public businessId: string;

  @IsString()
  @IsNotEmpty()
  public attributeId: string;

  @IsString()
  @IsNotEmpty()
  public attributeValue: string;

  public pagination: BuilderPaginationDto;
}
