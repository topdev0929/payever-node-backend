import { Injectable, Logger } from '@nestjs/common';
import * as FormData from 'form-data';
import * as rp from 'request-promise';
import * as fs from 'fs';
import { MediaTypeEnum, MediaUploadTypeEnum } from '../enums';
import { UploadMediaInterface, File } from '../interfaces';

@Injectable()
export class MediaUploaderService {
  constructor(
    private readonly logger: Logger,
  ) { }

  public async uploadAllMedia(
    medias: UploadMediaInterface[],
    filePaths: string[],
    type: MediaUploadTypeEnum,
    splitFiles: File[],
  ): Promise<any> {
    return Promise.all(
      medias.map(
        (media: UploadMediaInterface, index: number) => this.uploadMedia(media, filePaths[index], type, splitFiles),
      ),
    );
  }

  public async uploadMedia(
    media: UploadMediaInterface,
    filePath: string,
    type: MediaUploadTypeEnum,
    splitFiles: File[],
  ): Promise<any> {
    if (type === MediaUploadTypeEnum.Multipart) {
      return this.uploadFileMultipart(
        media.uploadUrl, 
        filePath, 
        media.parameters, 
        media.type || MediaTypeEnum.Video,
      ).catch();
    }

    if (type === MediaUploadTypeEnum.OctetStream) {
      return this.uploadOctectStream(
        media.uploadUrl, 
        filePath, 
        media.parameters, 
        media.type || MediaTypeEnum.Video,
      );
    }

    if (type === MediaUploadTypeEnum.ChunkUpload) {
      return this.chunkUpload(
        media, 
        splitFiles,
      );
    }
  }

  public async chunkUpload(
    media: UploadMediaInterface, 
    splitFiles: File[],
  ): Promise<any> {

    let startOffset = 0;
    let segmentIndex = 0;

    for (const splitFile of splitFiles) {
      this.insertData(media.request, media.bufferPath, splitFile.buffer);

      if (media.startOffset) {
        this.insertData(media.request, media.startOffset, startOffset);
      }

      if (media.segmentIndex) {
        this.insertData(media.request, media.segmentIndex, segmentIndex);
        media.request.headers['Content-length'] = Buffer.byteLength(splitFile.buffer);
        segmentIndex++;
      }

      const response = await rp(media.request);
      if (media.startOffset) {
        startOffset = response[media.variables.startOffset];
      }
    }
  }

  public async uploadOctectStream(
    url: string, 
    mediaLocation: string, 
    headers: any, 
    mediaType: MediaTypeEnum,
  ): Promise<any> {

    const options: any = {
      uri: url,
      body: mediaType === MediaTypeEnum.Image ? fs.createReadStream(mediaLocation) : fs.readFileSync(mediaLocation),
      headers,
      method: 'POST',
      encoding: null,
    };

    try {
      return rp(options);
    } catch (err) {
      if (err?.statusCode === 504) {
        return this.uploadOctectStream(url, mediaLocation, headers, mediaType);
      }
    }
  }

  public async uploadFileMultipart(
    url: string,
    mediaLocation: string,
    parameters: any,
    mediaType: MediaTypeEnum,
  ): Promise<any> {
    const form: FormData = new FormData();

    if (parameters) {
      for (const [attr, value] of Object.entries(parameters)) {
        form.append(attr, value);
      }
    }

    const data: any = mediaType === MediaTypeEnum.Image ?
    fs.createReadStream(mediaLocation) :
    fs.readFileSync(mediaLocation);

    form.append( 'file', data);
      
    this.logger.log(`Uploading media to ${url}`);

    const result: any = await (new Promise((resolve: any, reject: any) => {
      form.submit(url, (error: any, response: any) => {
        if (error) {
          reject(error);
        }
        resolve(response);
      });
    }));

    if (result === 504) {
      return this.uploadFileMultipart(url, mediaLocation, parameters, mediaType);
    }

    return result;
  }

  private insertData(payload: any, path: string, data: any): any {
    const keys: string[] = path.split('.');

    for (let i = 0; i < keys.length - 1; i++) {
      if (!payload[keys[i]]) {
        return;
      }
      payload = payload[keys[i]];
    }

    payload[keys.pop()] = data;
  }

}
