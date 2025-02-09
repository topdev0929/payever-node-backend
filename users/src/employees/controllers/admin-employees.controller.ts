import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import * as fastify from 'fastify';
import { validateOrReject } from 'class-validator';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Multipart } from 'fastify-multipart';
import * as csv from 'csv-parser';
import { plainToClass } from 'class-transformer';

import { Acl, AclActionsEnum, Roles, RolesEnum, User, UserTokenInterface, JwtAuthGuard } from '@pe/nest-kit';
import { BulkCreateEmployeesRowDto, CreateEmployeeForBusinessDto } from '../dto';
import { InviteConflictResolutionEnum } from '../enum';
import { BulkCreateEmployeeRowInterface, Employee } from '../interfaces';
import { InvitationService } from '../services';
import { bulkCreateEmployeesForBusinessesToCreateEmployeeDtoTransformer } from '../transformers';
import { InfoTransformPipe } from '../pipes';

const INVALID_CREDENTIALS_MESSAGE: string = 'Invalid credentials';

@Controller('admin/employees')
@ApiTags('admin')
@ApiBearerAuth()
@UsePipes(InfoTransformPipe)
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
export class AdminEmployeesController {
  constructor(
    private readonly inviteService: InvitationService,
  ) { }

  @Post('/bulk-create')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, description: 'Employee created' })
  @Acl({ microservice: 'settings', action: AclActionsEnum.create})
  public async bulkCreate(
    @User() user: UserTokenInterface,
    @Req() req: fastify.FastifyRequest,
    @Res() res: fastify.FastifyReply<any>,
  ): Promise<Employee[]> {
    const employees: Employee[] = [];
    const rows: BulkCreateEmployeesRowDto[] = await this.getParsedCsv(req);
    try {
      await Promise.all(rows.map(this.validateWrapper));
      const dtos: CreateEmployeeForBusinessDto[] = rows.map(
        bulkCreateEmployeesForBusinessesToCreateEmployeeDtoTransformer,
      );
      const inviteConflictResolution: InviteConflictResolutionEnum = (req.query as any).inviteConflictResolution;

      for (const dto of dtos) {
        const businessId: string = dto.businessId;
        const employee: Employee = await this.inviteService.create(
          user, 
          dto, 
          businessId, 
          true,
          inviteConflictResolution,
        );
        employees.push(employee);
      }

      return res.status(HttpStatus.OK).send(employees);
    } catch (e) {
      res.status(e?.response?.status || HttpStatus.INTERNAL_SERVER_ERROR).send(e?.response?.data || e?.response || e);
    }
  }

  private validateWrapper(item: any): Promise<void> {
    return validateOrReject(item, {
      whitelist: true,
    });
  }

  private async getParsedCsv(req: fastify.FastifyRequest): Promise<BulkCreateEmployeesRowDto[]> {
    const uploadedFile: Multipart<true> = await req.file();

    // tslint:disable-next-line: typedef
    return new Promise((resolve, reject) => {
      const result: BulkCreateEmployeeRowInterface[] = [];
      uploadedFile.file
        .pipe(csv())
        .on('data', (chunk: BulkCreateEmployeeRowInterface) => result.push(chunk))
        .on('end', () => {
          const typedResult: BulkCreateEmployeesRowDto[] = result.map(
            (plain: BulkCreateEmployeeRowInterface) => plainToClass(BulkCreateEmployeesRowDto, plain),
          );
          resolve(typedResult);
        })
        .on('error', reject);
    });
  }
}
