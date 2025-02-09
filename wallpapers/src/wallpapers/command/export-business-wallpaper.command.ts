import { Injectable, Logger } from '@nestjs/common';
import { Command } from '@pe/nest-kit';
import { BusinessWallpapersModel } from '../models';
import { BusinessWallpapersService } from '../services';
import { BusinessWallpaperMessagesProducer } from '../producers';

@Injectable()
export class ExportBusinessWallpaperCommand {

  constructor(
    private readonly businessWallpapersService: BusinessWallpapersService,
    private readonly businessWallpaperMessageProducer: BusinessWallpaperMessagesProducer,
    private readonly logger: Logger,
  ) { }

  @Command({ command: 'export:business:current:wallpaper', describe: 'export business current wallpaper' })
  public async export(): Promise<void> {
    const limit: number = 100;

    const processedBusinessCount: number = await this.checkBusinessAssignedWallpapers(limit);

    this.logger.log(processedBusinessCount + ' business wallpapers were processed');
  }

  private async checkBusinessAssignedWallpapers(limit: number): Promise<number> {
    let processedBusinessCount: number = 0;
    let skip: number = 0;
    while (true) {
      const businesses: BusinessWallpapersModel[]  = await this.businessWallpapersService.getList(
        { currentWallpaper : { $ne : null } },
        limit,
        skip,
      );
      if (!businesses.length) {
        break;
      }
      processedBusinessCount += businesses.length;
      for (const business of businesses) {
        await this.sendBusinessCurrentWallpaperMessage(business);
      }

      skip += limit;
    }

    return processedBusinessCount;
  }

  private async sendBusinessCurrentWallpaperMessage(businessWallpapers: BusinessWallpapersModel): Promise<void> {
    if (!businessWallpapers.currentWallpaper) {
      return ;
    }
    await this.businessWallpaperMessageProducer.produceBusinessCurrentWallpaperExported(
      businessWallpapers.businessId,
      businessWallpapers.currentWallpaper,
    );
  }
}
