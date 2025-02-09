import { readFileSync } from 'fs';
import * as XLSX from 'xlsx';
import { UploadMediaDto } from '../dto';
import { UploadMediaConverter } from '../converters';
import { ExcelSheetList } from '../enums';

export class ExcelHelper {
  public static getMediaList(): { added: UploadMediaDto[]; deleted: UploadMediaDto[]} {
    let mediaList: UploadMediaDto[] = [];
    let deletedMediaList: UploadMediaDto[] = [];

    for (const sheet of ExcelSheetList) {
      try {
        const { added, deleted}: { added: UploadMediaDto[]; deleted: UploadMediaDto[]}
          = ExcelHelper.getMediaListByCategory(sheet);
        mediaList = mediaList.concat(added);
        deletedMediaList = deletedMediaList.concat(deleted);
      } catch (e) {
      }
    }

    return { added: mediaList, deleted: deletedMediaList};
  }

  public static getMediaListByCategory(
    category: string,
  ): { added: UploadMediaDto[]; deleted: UploadMediaDto[]} {
    const fileSource: any = readFileSync(`./static/payever Studio-new.xlsx`);
    const workbook: XLSX.WorkBook = XLSX.read(fileSource, { type: 'buffer'});

    const sheetName: string = workbook.SheetNames.find(
      (name: string) => name.toLowerCase().trim() === category.toLowerCase(),
    );

    if (!sheetName) {
      throw new Error(`Sheet with name "${category}" not found`);
    }

    const list: any = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const mediaList: UploadMediaDto[] = [];

    const deletedMediaList: UploadMediaDto[] = [];

    let count: number = 2;
    for (const xlsData of list) {
      const medias: UploadMediaDto[] = UploadMediaConverter.fromXls(xlsData, category, count);

      for (const media of medias) {
        if (media.isDeleted) {
          deletedMediaList.push(media);
        } else if (media.area) {
          mediaList.push(media);
        }
      }
      count++;
    }

    return { added: mediaList, deleted: deletedMediaList};
  }
}
