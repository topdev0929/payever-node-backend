import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import * as mime from 'mime-kind';
import { File } from '../interfaces';
import { CreatePostDto } from '../dtos';
import { videoMimeTypes } from '../settings';
import { BusinessLocalModel } from '../../business';
import { MediaTypeEnum } from '../enums';

@Injectable()
export class MultipartService {
  constructor(
    private readonly logger: Logger,
  ) { }

  public async setHandler<T = any>(
    request: any,
    response: any,
    asyncHandler: (
      files: File[], 
      business: BusinessLocalModel, 
      body: CreatePostDto, 
      attachmentsUrl: string[], 
      postId?: string,
    ) => Promise<T>,
    business: BusinessLocalModel,
    data: CreatePostDto,
    acceptMimeTypes: string[] = videoMimeTypes,
    postId?: string,
  ): Promise<void> {
    const files: File[] = [];
    const attachmentsUrl: string[] = [];
    for await (const part of this.partsGenerator(request)) {
      if (typeof part.toBuffer !== 'function') {
        attachmentsUrl.push(part.value);
        continue;
      }
      const {
        fieldname: field,
        filename: originalname,
        encoding,
      }: any = part;
      const buffer: Buffer = await part.toBuffer();
      const mimeType: { ext: string; mime: string } = mime.sync(buffer);
      if (!mimeType || !acceptMimeTypes.includes(mimeType.mime)) {
        response
          .code(400)
          .send({
            message: 'Video type is not correct',
            statusCode: 400,
          });

        return Promise.resolve(response);
      }

      files.push({ field, originalname, encoding, mimetype: mimeType.mime, buffer });
    }

    asyncHandler(files, business, data, attachmentsUrl.filter(Boolean), postId)
      .then((result: T) => {
        response
          .code(200)
          .send(
            result,
          );
      })
      .catch((e: any) => {
        this.logger.error(e);
        response
          .code(500)
          .send({
            message: e.message || 'Internal server error',
            statusCode: e.statusCode || e.status || 500,
          });
      });
  }

  private async* partsGenerator(request: any): any {

    if (!request.body?.file) {
      return;
    }

    try {

      if (Array.isArray(request.body.file)) {
        for (const part of request.body.file) {
          yield part;
        }
      } else {
        yield request.body.file;
      }

    } catch (ex) {
      if (ex.code === 'FST_INVALID_MULTIPART_CONTENT_TYPE') {
        throw new BadRequestException(`invalid multipart content type`);
      }
      throw ex;
    }
  }
}
