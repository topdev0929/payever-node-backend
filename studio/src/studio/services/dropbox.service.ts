import { HttpService, Injectable, Logger } from '@nestjs/common';
import { environment } from '../../environments';
import { Dropbox } from 'dropbox';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  AttributeSchemaName,
  DropboxMediaSchemaName,
  ExcelMediaSchemaName,
  SubscriptionMediaSchemaName,
} from '../schemas';
import { AttributeModel, DropboxMediaModel, ExcelMediaModel, FolderModel, SubscriptionMediaModel } from '../models';
import { DropboxPaginationInterface, MediaAttributeInterface, PaginationInterface } from '../interfaces';
import { ImageExtentionEnum, MediaTypeEnum, VideoExtentionEnum } from '../enums';
import { PaginationDto } from '../dto';
import { ExcelHelper, ImageCompressionHelper, PaginationHelper, VideoCompressionHelper } from '../helpers';
import * as FormData from 'form-data';
import { FolderSchemaName } from '@pe/folders-plugin';
import * as lockFile from 'lockfile';
import { Mutex } from '@pe/nest-kit';

const miningLock: string = 'dropbox-mining.lockfile';
const downloadLock: string = 'dropbox-download.lockfile';
const mutexSave: string = 'mutex-save';
const excelLock: string = 'dropbox-excel.lockfile';
const setAttributeLock: string = 'dropbox-set-attribute.lockfile';

// tslint:disable:object-literal-sort-keys
const MimeTypes: any = {
  'jpg': 'image/jpg',
  'jpeg': 'image/jpeg',
  'png': 'image/png',
  'gif': 'image/gif',
  'svg': 'image/svg',
  'pdf': 'application/pdf',
  'mp4': 'video/mp4',
  'mov': 'video/quicktime',
  'avi': 'video/x-msvideo',
  'wmv': 'video/x-ms-wmv',
  'flv': 'video/x-flv',
  'm4v': 'video/x-m4v',
};

@Injectable()
export class DropboxService {
  private dropBoxAccessToken: string;
  private dropbox: Dropbox;
  constructor(
    private readonly httpService: HttpService,
    private readonly logger: Logger,
    private readonly mutex: Mutex,
    @InjectModel(SubscriptionMediaSchemaName) private readonly subscriptionMediaModel: Model<SubscriptionMediaModel>,
    @InjectModel(DropboxMediaSchemaName) private readonly dropboxMediaModel: Model<DropboxMediaModel>,
    @InjectModel(FolderSchemaName) private readonly folderModel: Model<FolderModel>,
    @InjectModel(ExcelMediaSchemaName) private readonly excelMediaModel: Model<ExcelMediaModel>,
    @InjectModel(AttributeSchemaName) private readonly attributeModel: Model<AttributeModel>,
  ) {
    this.dropBoxAccessToken = environment.dropboxAccessToken;
    this.dropbox = new Dropbox(
      {
        accessToken: this.dropBoxAccessToken,
      },
    );
  }

  public async getDropboxMedia(
    pagination: PaginationDto,
    type: MediaTypeEnum = null,
  ): Promise<DropboxPaginationInterface> {
    const page: PaginationInterface = PaginationHelper.getPagination(pagination);
    const sort: any = PaginationHelper.getSortQuery(pagination);
    const query: any = type ? { type } : { };

    const data: DropboxMediaModel[] = await this.dropboxMediaModel.find(query)
      .sort(sort)
      .skip(page.skip)
      .limit(page.limit)
      .exec();

    const total: number = await this.dropboxMediaModel.find(query).count().exec();

    return {
      data,
      info: {
        page: pagination.page,
        perPage: page.limit,
        total: total,
      },
    };
  }

  public async getFailed(pagination: PaginationDto): Promise<DropboxPaginationInterface> {
    const page: PaginationInterface = PaginationHelper.getPagination(pagination);
    const sort: any = PaginationHelper.getSortQuery(pagination);
    const query: any = {
      $and: [
        { tries : { $gt : 0 } },
        { lastError : { $exists : true } },
      ],
    };

    const data: DropboxMediaModel[] = await this.dropboxMediaModel.find(query)
      .sort(sort)
      .skip(page.skip)
      .limit(page.limit)
      .exec();

    const total: number = await this.dropboxMediaModel.find(query).count().exec();

    return {
      data,
      info: {
        page: pagination.page,
        perPage: page.limit,
        total: total,
      },
    };
  }

  public async resetError(): Promise<{ ok: number }> {
    return this.dropboxMediaModel.updateMany(
      {
        $and : [
          { tries : { $gt : 0 } },
          { lastError : { $ne : '{"message":"Maximum size is 25MB","statusCode":400}'} },
          { lastError : { $ne : '{"message":"Maximum size is 50MB","statusCode":400}'} },
        ],
      },
      {
        $set: { tries : 0 },
      },
    );
  }

  public async miningTrigger(path: string = ''): Promise<any> {
    lockFile.check(miningLock, { }, async (error: any, isLocked: any) => {
      if (error) {
        return;
      }
      if (isLocked) {
        this.logger.log(miningLock + ' is locked');
      } else {
        lockFile.lock(miningLock, { }, async (error2: any) => {
          if (error2) {
            return;
          }
          try {
            await this.mining(path);
          } catch (e) {
            this.logger.error(e);
          }
          lockFile.unlock(miningLock);
        });
      }
    });
  }

  public async downloadTrigger(): Promise<any> {
    lockFile.check(downloadLock, { }, async (error: any, isLocked: any) => {
      if (error) {
        return;
      }
      if (isLocked) {
        this.logger.log(downloadLock + ' is locked');
      } else {
        lockFile.lock(downloadLock, { }, async (error2: any) => {
          if (error2) {
            return;
          }
          try {
            await this.download();
          } catch (e) {
            this.logger.error(e);
          }
          lockFile.unlock(downloadLock);
        });
      }
    });
  }

  public async excelTrigger(): Promise<any> {
    lockFile.check(excelLock, { }, async (error: any, isLocked: any) => {
      if (error) {
        return;
      }
      if (isLocked) {
        this.logger.log(excelLock + ' is locked');
      } else {
        lockFile.lock(excelLock, { }, async (error2: any) => {
          if (error2) {
            return;
          }
          try {
            await this.excel();
          } catch (e) {
            this.logger.error(e);
          }
          lockFile.unlock(excelLock);
        });
      }
    });
  }

  public async setAttributeTrigger(): Promise<any> {
    lockFile.check(setAttributeLock, { }, async (error: any, isLocked: any) => {
      if (error) {
        return;
      }
      if (isLocked) {
        this.logger.log(setAttributeLock + ' is locked');
      } else {
        lockFile.lock(setAttributeLock, { }, async (error2: any) => {
          if (error2) {
            return;
          }
          try {
            await this.setAttribute();
          } catch (e) {
            this.logger.error(e);
          }
          lockFile.unlock(setAttributeLock);
        });
      }
    });
  }

  private async excel(): Promise<any> {
    const data: any = ExcelHelper.getMediaList();

    for (const media of data.added) {
      try {
        await this.excelMediaModel.create(media);
      } catch (e) {
        this.logger.log(e);
      }
    }
  }

  private async setAttribute(): Promise<any> {
    const medias: SubscriptionMediaModel[] = await this.subscriptionMediaModel.find().exec();

    let count: number = 0;

    for (const media of medias) {
      const regex: RegExp = new RegExp(media.name, 'ig');
      const excelMedia: ExcelMediaModel = await this.excelMediaModel.findOne({ path : regex }).exec();
      if (excelMedia) {
        try {
          await this.saveAttribute(media, excelMedia);
        } catch (e) {
          this.logger.log(e);
        }
        count++;
      }
    }
  }

  private async saveAttribute(media: SubscriptionMediaModel, excelMedia: ExcelMediaModel): Promise<any> {
    const obj: any = excelMedia.toObject();

    const mediaAttributes: MediaAttributeInterface[] = [];
    const excludeProps: string[] = ['_id', '__v', 'createdAt', 'updatedAt', 'path'];

    for (const prop in obj) {
      if (excludeProps.includes(prop)) {
        continue;
      }
      const attribute: AttributeModel = await this.attributeModel.findOneAndUpdate(
        {
          name: prop,
          type: 'dropbox',
        },
        {
          $set: {
            name: prop,
            type: 'dropbox',
          },
        },
        {
          new: true,
          setDefaultsOnInsert: true,
          upsert: true,
        },
      ).exec();

      switch (true) {
        case typeof obj[prop] === 'string':
          mediaAttributes.push(
            {
              attribute: attribute._id,
              value: obj[prop],
            },
          );
          break;
        case typeof obj[prop] === 'object':
          if (Array.isArray(obj[prop])) {
            for (const prop2 of obj[prop]) {
              mediaAttributes.push(
                {
                  attribute: attribute._id,
                  value: prop2,
                },
              );
            }
          }
          break;
        default:
          mediaAttributes.push(
            {
              attribute: attribute._id,
              value: obj[prop].toString(),
            },
          );
          break;
      }
    }

    await this.subscriptionMediaModel.findOneAndUpdate(
      {
        _id: media._id,
      },
      {
        $addToSet: {
          attributes: mediaAttributes as any,
        },
      },
    ).exec();
  }

  private async mining(path: string = '', cursor: string = null): Promise<any> {
    let result: any;

    if (!cursor) {
      result = await this.dropbox.filesListFolder({ path: path.trim()});
    } else {
      result = await this.dropbox.filesListFolderContinue({ cursor });
    }

    for (const entry of result.result.entries) {
      if (entry['.tag'] === 'folder') {
        this.logger.log(`${entry['.tag']} ${entry.path_lower}`);
        await this.mining(entry.path_lower);
      } else {
        this.logger.log(`${entry['.tag']} ${entry.name}`);
        const extension: string = this.regexExtension(entry.name);

        if (Object.values(ImageExtentionEnum).includes(extension as any)) {
          await this.findOneAndUpdate(entry, 'image');
        } else if (Object.values(VideoExtentionEnum).includes(extension as any)) {
          await this.findOneAndUpdate(entry, 'video');
        }
      }
    }

    if (result.has_more) {
      await this.mining(null, result.cursor);
    }

    return result;
  }

  private async download(bigFile: boolean = false): Promise<any> {
    const limit: number = bigFile ? 1 : 5;
    let querySize: any = { size: { $lt: 52428800}};
    if (bigFile) {
      querySize = { size: { $lt: environment.bigFileSize}};
    }

    const dropboxes: DropboxMediaModel[] = await this.dropboxMediaModel.find(
      {
        $and: [
          querySize,
          {
            $or : [
              { downloaded: false },
              { downloaded: { $exists : false } },
            ],
          },
          { isDownloadable: true },
          {
            $or : [
              { tries: 0 },
              { tries: { $exists : false } },
            ],
          },
        ],
      },
    ).sort({ size: 1}).limit(limit).exec();

    if (dropboxes.length === 0) {
      if (!bigFile) {
        // start processing big file
        await this.download(true);
      }

      return ;
    }

    const promise: any[] = [];

    for (const dropbox of dropboxes) {
      promise.push(this.save(dropbox, bigFile));
    }

    await Promise.all(promise);

    await this.download(bigFile);
  }

  private async save(dropbox: DropboxMediaModel, bigFile: boolean = false): Promise<any> {
    return this.mutex.lock(
      mutexSave,
      dropbox.id,
      async () => {
        this.logger.log(`start processing ${dropbox.name} with size ${dropbox.size}`);
        try {
          const folderId: string = await this.createFolderTree(dropbox.path);
          const mime: string = this.getMimeByName(dropbox.name);
          const jsonString: string = await this.uploadFileToMedia(dropbox, mime, bigFile);
          let data: any;

          try {
            data = JSON.parse(jsonString);
          } catch { }

          if (!data?.url) {
            this.logger.log(jsonString);
            throw new Error(jsonString);
          }

          await this.subscriptionMediaModel.findOneAndUpdate(
            {
              name: dropbox.name,
            },
            {
              $set : {
                mediaType: dropbox.type,
                name: dropbox.name,
                parentFolder: folderId,
                subscriptionType: 0,
                url: data.url,
                // if bigfile then already compressed above
                compressed: bigFile,
              } as any,
            },
            {
              new: true,
              setDefaultsOnInsert: true,
              upsert: true,
            },
          ).exec();

          await dropbox.update(
            {
              $set: {
                downloaded: true,
              },
            },
          ).exec();
          this.logger.log(`done processing ${dropbox.name}`);
        } catch (e) {
          this.logger.log(e.message);
          await dropbox.update(
            {
              $inc: {
                tries: 1,
              },
              $set: {
                lastError: e.message,
              },
            },
          ).exec();
          this.logger.log(`failed processing ${dropbox.name}`);
        }
      },
      {
        delay: 100,
        retries: 1,
        timeout: 300000,
      },
    );
  }

  private async createFolderTree(path: string = ''): Promise<any> {
    const paths: string[] = path.split('/');
    paths.shift();
    paths.pop();
    let parent: string;
    // convert paths to folder tree
    for (const folder of paths) {
      const existing: FolderModel = await this.folderModel.findOne(
        {
          name: folder,
          parentFolder: parent,
        },
      ).exec();
      if (existing) {
        parent = existing._id;
      } else {
        try {
          const newFolder: FolderModel = await this.folderModel.findOneAndUpdate(
            {
              name: folder,
              parentFolder: parent,
            },
            {
              $set:
                {
                  business: null,
                  name: folder,
                  parentFolder: parent,
                } as any,
            },
            {
              new: true,
              setDefaultsOnInsert: true,
              upsert: true,
            },
          ).exec();
          parent = newFolder._id;
        } catch (err) {
          if (err.name === 'MongoError' && err.code === 11000) {
            // recheck existing, this can happen because multiple thread run at the same time
            this.logger.log('recheck existing folder');
            parent = await this.recheckExistingFolder(err, folder, parent, existing);
          } else {
            throw err;
          }
        }
      }
    }

    return parent;
  }

  private async recheckExistingFolder(
    err: Error,
    folder: string,
    parent: string,
    existing: FolderModel,
  ): Promise<string> {
    const existing2: FolderModel = await this.folderModel.findOne(
      {
        name: folder,
        parentFolder: parent,
      },
    ).exec();
    if (existing2) {
      parent = existing._id;
    } else {
      throw err;
    }

    return parent;
  }

  private async compressing(buffer: Buffer, mediaType: MediaTypeEnum): Promise<Buffer> {
    if (mediaType === MediaTypeEnum.IMAGE) {
      return ImageCompressionHelper.compress(buffer);
    } else if (mediaType === MediaTypeEnum.VIDEO) {
      return VideoCompressionHelper.compress(buffer);
    }
  }

  private async uploadFileToMedia(
    dropbox: DropboxMediaModel,
    mime: string,
    bigFile: boolean = false,
  ): Promise<any> {
    let result: any = null;
    result = await this.dropbox.filesDownload({ path: dropbox.path.trim() });
    const url: string = environment.mediaServiceUrl + `/api/storage/file`;
    let newBuffer: Buffer = null;
    if (bigFile) {
      newBuffer = await this.compressing(result.result.fileBinary, dropbox.type as MediaTypeEnum);
      await dropbox.update(
        {
          $set: {
            compressedSize: Buffer.byteLength(newBuffer),
          },
        },
      ).exec();
    }

    const finalBuffer: Buffer = newBuffer ? newBuffer : result.result.fileBinary;
    const byteLength: number = Buffer.byteLength(finalBuffer);
    if ( byteLength >= 52428800 ) {
      this.logger.log(`stop processing file, size is ${byteLength} byte`);

      return '{"message":"Maximum size is 50MB","statusCode":400}';
    }

    /* eslint @typescript-eslint/no-misused-promises:0 */
    return new Promise(async (resolve: (data: string) => any, reject: (err: Error) => any): Promise<void> => {
      const formData: any = new FormData();
      formData.append(
        'my_file',
        finalBuffer,
        { filename: dropbox.name, contentType: mime ? mime : 'image/jpeg'},
      );
      formData.submit(url, (error: any, response: any) => {
        if (error) {
          reject(error);
          result = null;
        }
        let data: string = '';
        response.on('readable', () => {
          data += response.read();
        });
        response.on('end', () => {
          resolve(data);
          result = null;
        });
        response.on('error', (err: any) => {
          reject(err);
          result = null;
        });
      });
    });
  }

  private async findOneAndUpdate(data: any, type: string = 'image'): Promise<void> {
    const existing: DropboxMediaModel = await this.dropboxMediaModel.findOne(
      {
        sourceId: data.id,
      },
    ).exec();

    if (existing?.lastModified.getTime() === Date.parse(data.server_modified)) {
      return ;
    }

    await this.dropboxMediaModel.findOneAndUpdate(
      {
        sourceId: data.id,
      },
      {
        $set: {
          downloaded: false,
          isDownloadable: data.is_downloadable,
          lastModified: data.server_modified,
          name: data.name,
          path: data.path_lower,
          size: data.size,
          sourceId: data.id,
          tries: 0,
          type: type,
        },
      },
      {
        setDefaultsOnInsert: true,
        upsert: true,
      },
    ).exec();
  }

  private regexExtension(name: string): string {
    const regex: RegExp = /.+\.(.+)/;
    const found: string[] = name.match(regex);

    return found[1].toLowerCase();
  }

  private getMimeByName(name: string): string {
    const extension: string = this.regexExtension(name);

    return MimeTypes[extension];
  }
}
