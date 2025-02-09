import { Transform, Type } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { ListDto } from './list.dto';

export class AdminMailListDto extends ListDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  @Transform((value: string) => value.split(','))
  public businessIds?: string[];
}
