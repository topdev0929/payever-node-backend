import { SectionDto } from '../../integration';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';

@Exclude()
export class UpdateSectionsDto {
  @ApiProperty({ type: [SectionDto], required: true })
  @Expose()
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true})
  @Type(() => SectionDto)
  public sections: SectionDto[];
}
