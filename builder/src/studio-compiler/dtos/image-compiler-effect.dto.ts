import { IsNotEmpty, IsString } from 'class-validator';
import { PebEffect } from '@pe/builder-core';

export class ImageCompilerEffectDto implements PebEffect {
  @IsString()
  @IsNotEmpty()
  public target: string;

  @IsString()
  @IsNotEmpty()
  public type: any;

  @IsNotEmpty()
  public payload: any;
}
