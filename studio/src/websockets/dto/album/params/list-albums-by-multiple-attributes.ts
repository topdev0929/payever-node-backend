import { IsNotEmpty, IsString } from 'class-validator';
import { AttributeFilterDto, BuilderPaginationDto } from '../../../../studio/dto';

export class ListAlbumsByMultipleAttributes extends AttributeFilterDto {
  @IsString()
  @IsNotEmpty()
  public businessId: string;

  public pagination: BuilderPaginationDto;
}
