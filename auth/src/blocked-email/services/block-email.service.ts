import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { tmpdir } from 'os';
import { get } from 'https';
import { join } from 'path';
import { ReadStream, createReadStream, writeFileSync, mkdirSync, existsSync, rmdirSync } from 'fs';
import { Interface as ReadlineInterface, createInterface } from 'readline';

import { BlockEmailModel } from '../models/block-email.model';
import { BlockEmailInterface } from '../interfaces/block-email.interface';
import { BlockEmailSchemaName } from '../schemas';
import { EmailTypeEnum } from '../enums/email-type.enum';
import { environment } from '../../environments';

const DOMAINS_BULK_SIZE: number = 500;

@Injectable()
export class BlockEmailService {
  constructor(
    @InjectModel(BlockEmailSchemaName) private readonly blockEmailModel: Model<BlockEmailModel>,
    protected readonly logger: Logger,
  ) { }

  public async getAll(): Promise<BlockEmailModel[]> {
    return this.blockEmailModel.find({ });
  }

  public async find(conditions: FilterQuery<BlockEmailModel>): Promise<BlockEmailModel[]> {
    return this.blockEmailModel.find(conditions);
  }

  public async findOneBy(conditions: FilterQuery<BlockEmailModel>): Promise<BlockEmailModel> {
    return this.blockEmailModel.findOne(conditions);
  }

  public async update(findQuery: any, dto: BlockEmailInterface): Promise<void> {
    await this.blockEmailModel.updateOne(
      findQuery,
      {
        $set: {
          ...dto,
        },
      },
      {
        new: true,
      },
    ).exec();
  }

  public async remove(conditions: FilterQuery<BlockEmailModel>): Promise<void> {
    await this.blockEmailModel.deleteOne(conditions);
  }

  public async create(dto: BlockEmailInterface): Promise<BlockEmailModel> {
    return this.blockEmailModel.create(
      { ...dto },
    );
  }

  public async checkBlocked(email: string): Promise<boolean> {
    if (!email) {
      return false;
    }

    const emailDomain: string = email.split('@').pop();
    if (!emailDomain) {
      return true;
    }

    const matchedBanList: BlockEmailModel[] = await this.find({
      $or: [
        {
          type: EmailTypeEnum.EXACT_MATCH,
          value: email,
        },
        {
          type: EmailTypeEnum.DOMAIN,
          value: emailDomain,
        },
      ],
    });

    return matchedBanList.length > 0;
  }

  public async bulkInsertBlockedDomains(domains: string[]): Promise<void> {
    const blockedDomains: BlockEmailInterface[] = domains.map((domain: string) => {
      return {
        type: EmailTypeEnum.DOMAIN,
        value: domain,
      };
    });

    const writes: any[] = blockedDomains.map((blockedDomain: BlockEmailInterface) => {
      return  { 
        updateOne:
          {
            filter: { value: blockedDomain.value },
            update: { $set: { ...blockedDomain } },
            upsert : true,
          },
        };
    });

    await this.blockEmailModel.bulkWrite(writes);
  }

  public async synchronizeBlockedEmails(): Promise<void> {
    const blockedEmailDomainFileUrl: string = environment.blockedEmailDomainFileUrl;
    let filePath: string = '';

    try { 
      const buffer: Buffer = await this.getMediaFromUrl(blockedEmailDomainFileUrl);
      filePath = await this.saveFile(buffer);
    } catch (error) {
      this.logger.log(
        { 
          error: error.message,
          message: 'Error downloading email blocked list file', 
          status: error.status,
        }, 
        'BlockEmailService',
      );

      return;
    }

    const fileStream: ReadStream = createReadStream(filePath);
    const rl: ReadlineInterface = createInterface({
      crlfDelay: Infinity,
      input: fileStream,
    });

    const blockedDomains: string[] = [];
    let totalProcessed: number = 0;

    this.logger.log(`Processing first ${DOMAINS_BULK_SIZE} domains..`);

    // tslint:disable-next-line: await-promise
    for await (const domain of rl) {
      totalProcessed++;
      blockedDomains.push(domain.trim());

      if (blockedDomains.length === DOMAINS_BULK_SIZE) {
        await this.bulkInsertBlockedDomains(blockedDomains);
        this.logger.log(`Total Processed: ${totalProcessed}`);
        this.logger.log(`Processing next ${DOMAINS_BULK_SIZE} domains..`);
        blockedDomains.length = 0;
      }
    }

    if (blockedDomains.length > 0) {
      await this.bulkInsertBlockedDomains(blockedDomains);
    }

    this.logger.log(`Total Processed: ${totalProcessed}`);
  }

  private async getMediaFromUrl(url: string): Promise<Buffer> {
    this.logger.log(`Downloading media from ${url}`);

    return new Promise<Buffer>(
      (resolve: any, reject: any) => {
        get(url, (res: any) => {
          const chunks: Buffer[] = [];

          res.on('data', (chunk: Buffer) => {
            chunks.push(chunk);
          });
          res.on('end', () => {
            resolve(Buffer.concat(chunks));
          });
        }).on('error', reject);
      },
    );
  }

  private async saveFile(buffer: any): Promise<string> {
    const randomTempFolder: string = join(tmpdir(), 'blocked-email');
    const randomInputFile: string = 'domains';
    if (existsSync(randomTempFolder)) {
      rmdirSync(randomTempFolder, { recursive: true });
    }
    mkdirSync(randomTempFolder);
    const filePath: string = join(randomTempFolder, randomInputFile);
    this.logger.log(`Writing media to disk in path ${filePath}`);
    writeFileSync(filePath, buffer);

    return filePath;
  }
}
