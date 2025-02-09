import { GlbModelExtentionEnum, ImageExtentionEnum, MediaTypeEnum, ScriptExtentionEnum, VideoExtentionEnum } from '../enums';

export class MediaTypeHelper {
  public static getMediaType(type: string): MediaTypeEnum {
    if ((Object as any).values(ImageExtentionEnum).includes(type)) {
      return MediaTypeEnum.IMAGE;
    }
    if ((Object as any).values(VideoExtentionEnum).includes(type)) {
      return MediaTypeEnum.VIDEO;
    }
    if ((Object as any).values(ScriptExtentionEnum).includes(type)) {
      return MediaTypeEnum.SCRIPT;
    }
    if ((Object as any).values(GlbModelExtentionEnum).includes(type)) {
      return MediaTypeEnum.GLB_MODEL;
    }
  }
}
