import { UploadCountryCityWallpapersDto } from '../dto';
import * as path from 'path';

export class UploadCountryCityWallpapersConverter {
  public static fromXls(xlsData: any): UploadCountryCityWallpapersDto {
    const rootFolder: string = '02 Cities';
    if (!xlsData.City || !xlsData.Country || !xlsData['File Name'] || !xlsData['Folder Name']) {
      return;
    }
    const folderName: string = (xlsData['Folder Name'] !== rootFolder) ? xlsData['Folder Name'] : '';

    const filePath: string = path.join(
      `/storage server/wallpapers/${rootFolder}`,
      `/${folderName}/`,
      xlsData['File Name'],
    );

    return {
      city: xlsData.City,
      country: xlsData.Country,
      filename: xlsData['File Name'],
      folder: xlsData['Folder Name'],
      path: filePath,
    };
  }
}
