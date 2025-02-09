import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ImageCompilerEffectDto } from './image-compiler-effect.dto';
import { PebAction } from '@pe/builder-core';

export class ImageActionDto implements PebAction {
  public id: any;
  public name?: string;
  public targetPageId: null;
  public affectedPageIds: any[];
  public createdAt: Date;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ImageCompilerEffectDto)
  public effects: ImageCompilerEffectDto[];
}
