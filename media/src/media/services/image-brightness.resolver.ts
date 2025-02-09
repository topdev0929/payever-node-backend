import * as sharp from 'sharp';

export class ImageBrightnessResolver {
  public static async getBrightnessGradation(imageBuffer: Buffer): Promise<string> {
    const brightnessGradations: string[] = ['dark', 'default', 'light'];
    const brightnessRange: number = 255 / brightnessGradations.length;

    const averageBrightness: number = await this.getAverageBrightness(imageBuffer);

    const gradationIndex: number =  Math.floor(averageBrightness / brightnessRange);

    return brightnessGradations[gradationIndex];
  }

  private static async getAverageBrightness(imageBuffer: Buffer): Promise<number> {
    const stats: { channels: any } = await sharp(imageBuffer).stats();

    if (stats.channels.length === 0) {
      return 0;
    }

    const channelsMeanSum: number = stats.channels.reduce((total: number, channel: any) => {
      return total + channel.mean;
    },                                                    0);

    const channelsCount: number = stats.channels.length;

    return Math.round(channelsMeanSum / channelsCount);
  }
}
