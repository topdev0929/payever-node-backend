import { PebAction } from '@pe/builder-core';
import { ResolutionDto } from '../dtos';

export interface VideoPebActionInterface extends PebAction {
  fps: number;
  size: ResolutionDto;
}
