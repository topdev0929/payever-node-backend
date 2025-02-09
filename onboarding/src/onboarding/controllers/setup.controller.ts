import {
  Body,
  Controller,
  Post,
  UseGuards,
  HttpStatus,
  Req,
  Res,
  BadRequestException,
  NotImplementedException,
} from '@nestjs/common';
import * as fastify from 'fastify';
import { ApiTags, ApiResponse, ApiConsumes, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import {
  JwtAuthGuard,
  Roles,
  RolesEnum,
  User,
  UserTokenInterface,
  Acl,
  AclActionsEnum,
} from '@pe/nest-kit/modules/auth';
import { Multipart } from 'fastify-multipart';
import * as csv from 'csv-parser';
import { validateOrReject, ValidationError } from 'class-validator';
import { TokenResultDto } from '../dto/token-result.dto';
import { SetupMessageDto } from '../dto';
import { BulkImportService, SetupService } from '../services';
import { BulkSetupCsvRawRowInterface } from '../interfaces/incoming/bulk-setup-csv-row.interface';
import { bulkSetupCsvItemToSetupMessageDtoTransformer, trulyStringToBoolean } from '../transformers';
import { BulkSetupResponseInterface } from '../interfaces';
import { BulkImportModel } from '../models';
import { RabbitMqClient } from '@pe/nest-kit';
import { RabbitBinding } from '../enums';

function trimObjectKeysAndStringValues<T>(object: { [key: string]: any }): T {
  return Object.entries(object).reduce(
    (acc: T, [key, value]: [string, any]) => {
      acc[key.trim()] = typeof value === 'string' ? value.trim() : value;

      return acc;
    },
    { } as T,
  );
}

@Controller('setup')
@ApiTags('setup')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SetupController {
  constructor(
    private readonly setupService: SetupService,
    private readonly bulkImportService: BulkImportService,
    private readonly rabbitClient: RabbitMqClient,
  ) { }

  @Post()
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'commerceos', action: AclActionsEnum.create })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: TokenResultDto,
  })
  public async setup(
    @User() user: UserTokenInterface,
    @Body() setupDto: SetupMessageDto,
    @Req() req: fastify.FastifyRequest,
    @Res() res: fastify.FastifyReply<any>,
  ): Promise<BulkSetupResponseInterface> {
    try {
      // eslint-disable-next-line @typescript-eslint/typedef
      const data: string[] = req.headers.authorization.match(/Bearer (.+)/);

      const bulkImport: BulkImportModel = await this.bulkImportService.createImportTask();

      await this.setupService.setup(
        setupDto, 
        {
          accessToken: data[1],
          user,
          userAgent: req.headers['user-agent'],
        },
        bulkImport._id,
      );
      
      return res.status(HttpStatus.OK).send({ bulkImportId: bulkImport._id });
    } catch (e) {
      res.status(
        e?.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      ).send(e?.response?.data || e?.response || e.message || e);
    }
  }

  @Post('/bulk/upload')
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'commerceos', action: AclActionsEnum.create })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: [TokenResultDto],
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      properties: {
        file: {
          format: 'binary',
          type: 'string',
        },
      },
      type: 'object',
    },
  })

  public async setupBulkUpload(
    @User() user: UserTokenInterface,
    @Req() req: fastify.FastifyRequest,
    @Res() res: fastify.FastifyReply<any>,
  ): Promise<BulkSetupResponseInterface> {

    let bulkImportId: string = (req.query as any)?.bulkImportId;
    const [, token]: RegExpMatchArray = req.headers.authorization.match(/Bearer (.+)/);

    const multipart: Multipart<true> = await req.file();
    if (!multipart) {
      throw new BadRequestException('file not provided');
    }
    const attachToCurrentUserField: Multipart<string> = (multipart.fields['attach-to-current-user'] as any);
    const attachToCurrentUser: boolean = attachToCurrentUserField?.value !== 'false';
    const dryRunField: Multipart<string> = (multipart.fields['dry-run'] as any);
    const dryRun: boolean = trulyStringToBoolean(dryRunField?.value);
    try {
      const dtos: SetupMessageDto[] = await this.getSetupMessageDtos(multipart);
      if (!dryRun && !bulkImportId) {
        const bulkImport: BulkImportModel = await this.bulkImportService.createImportTask();
        bulkImportId = bulkImport._id;
      }
      for (const dto of dtos) {
        if (dryRun) {
          return res.status(HttpStatus.OK).send('dry-run');
        } else if (attachToCurrentUser) {
          await this.setupService.setup(
            dto, 
            {
              accessToken: token,
              user,
              userAgent: req.headers['user-agent'],
            },
            bulkImportId,
          );

        } else {
          throw new NotImplementedException();
        }
      }

      const payload = {
        _id: bulkImportId,
      };

      await this.rabbitClient.send(
        {
          channel: RabbitBinding.OnboardingProcessBulkImport,
          exchange: 'async_events',
        },
        {
          name: RabbitBinding.OnboardingProcessBulkImport,
          payload,
        },
      );
      res.status(HttpStatus.OK).send({ bulkImportId });
    } catch (e) {
      const eIsValidation: boolean = e?.[0] instanceof ValidationError;
      res.status(
        e?.response?.status || (eIsValidation && HttpStatus.BAD_REQUEST) || HttpStatus.INTERNAL_SERVER_ERROR,
      ).send(e?.response?.data || e?.response || e);
    }
  }

  private validateWrapper(item: any): Promise<void> {
    return validateOrReject(item, {
      forbidNonWhitelisted: true,
      whitelist: true,
    });
  }

  private async getSetupMessageDtos(multipart: Multipart<true>): Promise<SetupMessageDto[]> {
    // tslint:disable-next-line: typedef
    return new Promise((resolve, reject) => {
      const result: BulkSetupCsvRawRowInterface[] = [];
      multipart.file
        .pipe(csv())
        .on('data', (chunk: BulkSetupCsvRawRowInterface) => result.push(chunk))
        .on('end', () => {
          try {
            const typedResult: SetupMessageDto[] = result
              .map(trimObjectKeysAndStringValues)
              .map(bulkSetupCsvItemToSetupMessageDtoTransformer);
            Promise.all(
              typedResult.map(
                (item: SetupMessageDto) => this.validateWrapper(item),
              ),
            )
              .then(() => resolve(typedResult))
              .catch(reject);
          } catch (e) {
            reject(e);
          }
        })
        .on('error', reject);
    });
  }
}
