import { IsNotEmpty, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { VideoCompilerEffectDto } from './video-compiler-effect.dto';
import { ResolutionDto } from './resolution.dto';
import { PebAction } from '@pe/builder-core';

export class VideoActionDto  implements PebAction {
  public id: any;
  public name?: string;
  public targetPageId: null;
  public affectedPageIds: any[];
  public createdAt: Date;

  @IsOptional()
  @IsNumber()
  public fps: number;

  @ValidateNested()
  @Type(() => ResolutionDto)
  @IsNotEmpty()
  public size: ResolutionDto;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => VideoCompilerEffectDto)
  public effects: VideoCompilerEffectDto[];
}
