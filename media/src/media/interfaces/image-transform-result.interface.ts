import { ResizeOptions } from 'sharp';

export class ImageTransformResult {
  public width: number;
  public height: number;
  public options: ResizeOptions;
  public blur?: number;
}
