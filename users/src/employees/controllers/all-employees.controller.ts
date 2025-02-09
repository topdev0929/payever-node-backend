import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Delete,
  Req,
  Res,
  UseGuards,
  NotFoundException,
  UsePipes,
} from '@nestjs/common';
import * as fastify from 'fastify';
import { validateOrReject } from 'class-validator';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Multipart } from 'fastify-multipart';
import * as csv from 'csv-parser';
import { v4 as uuid } from 'uuid';
import { plainToClass } from 'class-transformer';

import { Acl, AclActionsEnum, Roles, RolesEnum, User, UserTokenInterface, JwtAuthGuard } from '@pe/nest-kit';
import { BulkCreateEmployeesRowDto, CreateEmployeeForBusinessDto } from '../dto';
import { InviteConflictResolutionEnum } from '../enum';
import { BulkCreateEmployeeRowInterface, BulkDeleteEmployeeRowInterface, Employee } from '../interfaces';
import { BulkImportService, EmployeeService, InvitationService, TaskService } from '../services';
import { bulkCreateEmployeesForBusinessesToCreateEmployeeDtoTransformer } from '../transformers';
import { UserService, UserDocument } from '../../user';
import { BulkDeleteEmployeeRowDto } from '../dto/employees/bulk-employee-delete-row.dto';
import { BulkImport, Task } from '../schemas';
import { InfoTransformPipe } from '../pipes';

const INVALID_CREDENTIALS_MESSAGE: string = 'Invalid credentials';

@Controller('employees')
@ApiTags('employees')
@ApiBearerAuth()
@UsePipes(InfoTransformPipe)
@UseGuards(JwtAuthGuard)
export class AllEmployeesController {
  constructor(
    private readonly inviteService: InvitationService,
    private readonly userService: UserService,
    private readonly employeeService: EmployeeService,
    private readonly bulkImportService: BulkImportService,
    private readonly taskService: TaskService,
  ) { }

  @Post('/bulk-create')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, description: 'Employee created' })
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'settings', action: AclActionsEnum.create })
  public async bulkCreate(
    @User() user: UserTokenInterface,
    @Req() req: fastify.FastifyRequest,
    @Res() res: fastify.FastifyReply<any>,
  ): Promise<Employee[]> {
    const employees: Employee[] = [];
    const tasks: Task[] = [];
    const rows: BulkCreateEmployeesRowDto[] = await this.getParsedCsv(req);
    const inviteConflictResolution: InviteConflictResolutionEnum = (req.query as any).inviteConflictResolution;

    try {
      await Promise.all(rows.map(this.validateWrapper));
      const dtos: CreateEmployeeForBusinessDto[] = rows.map(
        bulkCreateEmployeesForBusinessesToCreateEmployeeDtoTransformer,
      );

      const userModel: UserDocument = await this.userService.findOneByUserToken(user);
      for (const dto of dtos) {
        if (userModel.businesses.indexOf(dto.businessId) === -1) {
          throw new NotFoundException(`Business with _id "${dto.businessId}" not found`);
        }
      }

      const bulkImportTask: BulkImport = await this.bulkImportService.createImportTask();

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
        tasks.push({
          _id: uuid(),
          incomingData: dto as any,
          businessId: dto.businessId,
          bulkImportId: bulkImportTask._id,
          employeeId: employee._id,
        });
      }

      await this.taskService.createTasks(tasks);

      return res.status(HttpStatus.OK).send({ bulkImportId: bulkImportTask._id, employees });
    } catch (e) {
      res.status(e?.response?.status || HttpStatus.INTERNAL_SERVER_ERROR).send(e?.response?.data || e?.response || e);
    }
  }

  @Delete('/bulk-delete')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.admin)
  public async bulkDelete(
    @Req() req: fastify.FastifyRequest,
    @Res() res: fastify.FastifyReply<any>,
  ): Promise<any> {
    const rows: BulkDeleteEmployeeRowDto[] = await this.getBulkDeleteParsedCsv(req);

    try {
      await Promise.all(rows.map(this.validateWrapper));

      for (const row of rows) {
        const user: UserDocument = await this.userService.findByEmail(row.Email);
        if (user) {
          await this.userService.remove(user);
        } else {
          const employee: Employee = await this.employeeService.findOneBy({ email: row.Email });
          await this.employeeService.deleteEmployee(employee);
        }
      }

      return res.status(HttpStatus.OK).send(rows);
    } catch (e) {
      res.status(e?.response?.status || HttpStatus.INTERNAL_SERVER_ERROR).send(e?.response?.data || e?.response || e);
    }
  } 

  private validateWrapper(item: any): Promise<void> {
    return validateOrReject(item, {
      whitelist: true,
    });
  }

  private async getBulkDeleteParsedCsv(req: fastify.FastifyRequest): Promise<BulkDeleteEmployeeRowDto[]> {
    const uploadedFile: Multipart<true> = await req.file();

    // tslint:disable-next-line: typedef
    return new Promise((resolve, reject) => {
      const result: BulkDeleteEmployeeRowInterface[] = [];
      uploadedFile.file
        .pipe(csv())
        .on('data', (chunk: BulkDeleteEmployeeRowInterface) => result.push(chunk))
        .on('end', () => {
          const typedResult: BulkDeleteEmployeeRowDto[] = result.map(
            (plain: BulkDeleteEmployeeRowInterface) => plainToClass(BulkDeleteEmployeeRowDto, plain),
          );
          resolve(typedResult);
        })
        .on('error', reject);
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
