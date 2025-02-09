import { v4 as uuid } from 'uuid';
import { FastifyRequest } from 'fastify';
import { MultipartFile } from '@fastify/multipart';
import * as mimeTypes from 'mime-types';
import * as mime from 'mime-kind';
import * as detectCsv from 'detect-csv';
import * as detectSvg from 'detect-svg';
import * as fs from 'fs';
import * as path from 'path';
import { createParamDecorator, ExecutionContext, BadRequestException, NotImplementedException } from '@nestjs/common';
import { MimeTypesEnum } from '../../tools/mime-types.enum';
import { FsFile, MemFile, StreamFile } from '../../media/interfaces';
import { detectMimeTypeNative, DomPurifyTools, getFileSize, readFirstChunk } from '../../tools';

const TO_SANITIZE_MIME_TYPES: string[] = [MimeTypesEnum.HTML, MimeTypesEnum.SVG];
export interface FilesDecoratorParams {
  allowedMimeTypes: string[];
  storeType: 'memory' | 'fs' | 'stream';
  disableSanitizer?: boolean;
}

interface GetMimeTypeResult {
  ext: string;
  mime: string;
}

async function detectMimeType(
  firstChunk: Buffer | NodeJS.ReadableStream,
  fileName: string,
  defaultMimeType: string,
): Promise<GetMimeTypeResult> {
  let mimeType: { ext: string; mime: string };
  if (detectSvg(firstChunk)) {
    mimeType = {
      ext: 'svg',
      mime: MimeTypesEnum.SVG,
    };
  } else if (Buffer.isBuffer(firstChunk)) {
    const detectedMimeType: MimeTypesEnum = await detectMimeTypeNative(firstChunk) as MimeTypesEnum;
    if (detectedMimeType === 'application/octet-stream' && defaultMimeType === 'text/plain') {
      return {
        ext: 'txt',
        mime: defaultMimeType,
      };
    } else if (detectedMimeType === 'text/plain' && detectCsv(firstChunk)) {
      mimeType = {
        ext: 'csv',
        mime: 'text/csv',
      };
    } else {
      mimeType = {
        ext: mimeTypes.extension(detectedMimeType),
        mime: detectedMimeType,
      };
    }
  } else {
    return null;
  }

  return mimeType;
}

function cleanFileName(input: string): string {
  return input
    .replace(/[^\w\d:.-_]/g, '-')
    .replace(/\s+/g, '')
    .replace(/\(|\)/g, '');
}

function getUniqFileName(fileName: string, mimeType: string): string {
  return `${uuid()}-${path.parse(cleanFileName(fileName)).name}.${mimeType}`;
}

async function collectFilesToFs(
  params: FilesDecoratorParams,
  ctx: ExecutionContext,
  sanitize: boolean,
): Promise<FsFile[]> {
  const request: FastifyRequest = ctx.switchToHttp().getRequest();
  const fsFiles: FsFile[] = [];
  const multipartFiles: MultipartFile[] = await request.saveRequestFiles();

  for (const multipartFile of multipartFiles) {
    const firstChunk: Buffer = await readFirstChunk(multipartFile.filepath, 256);
    const mimeType: GetMimeTypeResult =
      await getMimeTypeByContent(firstChunk, multipartFile.filename, multipartFile.mimetype);

    if (sanitize && TO_SANITIZE_MIME_TYPES.includes(mimeType.mime)) {
      const filePath: string = multipartFile.filepath;
      const content: string = fs.readFileSync(multipartFile.filepath).toString();
      const sanitized: string = DomPurifyTools.sanitize(content);
      fs.writeFileSync(filePath, sanitized);
    }

    if (!mimeType || params.allowedMimeTypes && !params.allowedMimeTypes.includes(mimeType.mime)) {
      throw new BadRequestException({
        message: 'Document type is not correct',
        receivedMimeType: mimeType,
        statusCode: 400,
      });
    }
    fsFiles.push({
      fileSize: await getFileSize(multipartFile.filepath),
      localPath: multipartFile.filepath,
      mimeType: mimeType.mime,
      originalFileName: multipartFile.filename,
      uniqfileName: getUniqFileName(multipartFile.filename, mimeType.ext),
    });
  }

  return fsFiles;
}

async function collectFilesToMemory(
  params: FilesDecoratorParams,
  ctx: ExecutionContext,
  sanitize: boolean,
): Promise<MemFile[]> {
  const result: MemFile[] = [];
  const request: FastifyRequest = ctx.switchToHttp().getRequest();
  const parts: AsyncIterableIterator<MultipartFile> = request.files();

  for await (const part of parts) {
    const {
      fieldname,
      filename,
      encoding,
    } : {
      fieldname: string;
      filename: string;
      encoding: string;
    } = part;

    const partBuffer: Buffer = await part.toBuffer();
    let buffer: Buffer = encoding === 'base64' ? Buffer.from(partBuffer.toString(), 'base64') : partBuffer;
    const mimeType: { ext: string; mime: string } = await getMimeTypeByContent(buffer, part.filename, part.mimetype);

    if (sanitize && TO_SANITIZE_MIME_TYPES.includes(mimeType.mime)) {
      const content: string = buffer.toString();
      const sanitized: string = DomPurifyTools.sanitize(content);
      buffer = Buffer.from(sanitized);
    }

    if (!mimeType || params.allowedMimeTypes && !params.allowedMimeTypes.includes(mimeType.mime)) {
      throw new BadRequestException({
        message: 'Document type is not correct',
        receivedMimeType: mimeType,
        statusCode: 400,
      });
    }

    result.push({
      buffer,
      encoding,
      field: fieldname,
      mimetype: mimeType.mime as MimeTypesEnum,
      originalname: cleanFileName(filename),
    });
  }

  return result;
}

export async function getMimeTypeByContent(
  firstChunk: Buffer | NodeJS.ReadableStream,
  fileName: string,
  defaultMimeType: string,
): Promise<GetMimeTypeResult> {
  let mimeType: { ext: string; mime: string } = await mime(firstChunk);
  if (!mimeType) {
    mimeType = await detectMimeType(
      firstChunk,
      fileName,
      defaultMimeType,
    );

    if (!mimeType) {
      throw new BadRequestException({
        message: 'Cannot detect type of document',
        statusCode: 400,
      });
    }
  }

  switch (true) {
    case (mimeType.mime.includes('image/') && !mimeTypes.lookup(fileName)):
      mimeType = {
        ext: 'bin',
        mime: MimeTypesEnum.BIN,
      };
      break;
    case (mimeType.mime.includes('application/') && mimeTypes.lookup(fileName) === `image/svg+xml`):
    case (mimeType.mime.includes('text/') && mimeTypes.lookup(fileName) === `image/svg+xml`):
      mimeType = {
        ext: 'svg',
        mime: MimeTypesEnum.SVG,
      };
      break;
  }

  return mimeType;
}

// tslint:disable-next-line: typedef
export const Files = createParamDecorator<
  FilesDecoratorParams,
  ExecutionContext,
  Promise<FsFile[] | MemFile[] | StreamFile[]>
>(async (
  params: FilesDecoratorParams,
  ctx: ExecutionContext,
) => {
  const sanitize: boolean = !params.disableSanitizer;
  if (params.storeType === 'fs') {
    return collectFilesToFs(params, ctx, sanitize);
  } else if (params.storeType === 'memory') {
    return collectFilesToMemory(params, ctx, sanitize);
  } else if (params.storeType === 'stream') {
    throw new NotImplementedException(`No handler for 'stream'`);
  }
});
