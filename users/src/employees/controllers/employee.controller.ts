import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
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
import { Acl, AclActionsEnum, ParamModel, Roles, RolesEnum, User, UserTokenInterface } from '@pe/nest-kit';

import { BulkCreateEmployeeRowDto, CreateEmployeeDto, UpdateEmployeeDto } from '../dto';
import { BulkCreateEmployeeRowInterface, Employee } from '../interfaces';
import { EmployeeSchemaName } from '../schemas';
import { EmployeeService, InvitationService } from '../services';
import { EmployeeFilterInterface } from '../interfaces/employee-filter.interface';
import { EmployeeSearchInterface } from '../interfaces/employee-search.interface';
import { EmployeeOrderInterface } from '../interfaces/employee-order.interface';
import { EmployeeListingDto } from '../dto/employee-listing.dto';
import { bulkCreateEmployeeItemToCreateEmployeeDtoTransformer } from '../transformers';
import { InviteConflictResolutionEnum } from '../enum';
import { CustomGuard } from '../../custom-access/guard';
import { CustomAccessService } from '../../custom-access/services';
import { CustomAccessModel } from '../../custom-access/models';
import { FilterCollector } from '../helper/filter';
import { InfoTransformPipe } from '../pipes';

const INVALID_CREDENTIALS_MESSAGE: string = 'Invalid credentials';

@Controller('/employees/:businessId')
@ApiBearerAuth()
@ApiTags('employees')
@UsePipes(InfoTransformPipe)
@UseGuards(CustomGuard)
@Roles(RolesEnum.merchant)
export class EmployeeController {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly inviteService: InvitationService,
    private readonly customAccessService: CustomAccessService,
    private readonly filterCollector: FilterCollector,
  ) { }

  @Get('')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, description: 'Employees list' })
  @Acl({ microservice: 'settings', action: AclActionsEnum.read })
  public async list(
    @Param('businessId') businessId: string,
    @Query() listingDto: EmployeeListingDto,
  ): Promise<{ data: Employee[]; count: number }> {
    const filter: EmployeeFilterInterface =
      this.filterCollector.convertCondition(listingDto.filters as EmployeeFilterInterface);
    const search: EmployeeSearchInterface = listingDto.search as EmployeeSearchInterface;
    const order: EmployeeOrderInterface = listingDto.order as EmployeeOrderInterface;

    return this.employeeService.listEmployees(
      businessId,
      filter,
      search,
      order,
      listingDto.limit as number,
      listingDto.page as number,
    );
  }

  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, description: 'Employees list' })
  @Acl({ microservice: 'settings', action: AclActionsEnum.read })
  public async getCurrentTokenUser(
    @Param('businessId') businessId: string,
    @Param('userId') userId: string,
  ): Promise<{ data: Employee }> {
    const employee: Employee = await this.employeeService.findOneBy(
      { userId: userId },
    );

    if (!employee) {
      throw new NotFoundException('No employee found');
    }

    EmployeeService.checkAccess(employee, businessId);

    return { data: employee };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, description: 'Employees list' })
  @Acl({ microservice: 'settings', action: AclActionsEnum.read })
  public async get(
    @Param('businessId') businessId: string,
    @ParamModel(':id', EmployeeSchemaName, true) employee: Employee,
  ): Promise<{ data: Employee }> {
    EmployeeService.checkAccess(employee, businessId);

    const data = await this.employeeService.findEmployeeDetail(employee, businessId);

    return { data };
  }

  @Get('/count')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, description: 'Employees count' })
  @Acl({ microservice: 'settings', action: AclActionsEnum.read })
  public async countByEmail(
    @Param('businessId') businessId: string,
    @Query('email') email: string,
  ): Promise<number> {
    return this.employeeService.countByEmail(email, businessId);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, description: 'Employee created' })
  @Acl({ microservice: 'settings', action: AclActionsEnum.create })
  public async create(
    @User() user: UserTokenInterface,
    @Param('businessId') businessId: string,
    @Body() dto: CreateEmployeeDto,
    @Req() request: fastify.FastifyRequest,
  ): Promise<Employee> {
    const accessId: string = request.headers.access ? request.headers.access
      : ((request.query as any).access ? (request.query as any).access : null);

    if (accessId) {
      const customAccess: CustomAccessModel = await this.customAccessService.findByAccessId(accessId);
      if (customAccess) {
        return this.inviteService.createByCustomAccess(customAccess, dto, businessId);
      }
    }    

    return this.inviteService.create(user, dto, businessId);
  }

  @Post('/bulk-create')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, description: 'Employee created' })
  @Acl({ microservice: 'settings', action: AclActionsEnum.create })
  public async bulkCreate(
    @User() user: UserTokenInterface,
    @Param('businessId') businessId: string,
    @Req() req: fastify.FastifyRequest,
    @Res() res: fastify.FastifyReply<any>,
  ): Promise<Employee[]> {
    let employees: Employee[] = [];
    const rows: BulkCreateEmployeeRowDto[] = await this.getParsedCsv(req);
    const inviteConflictResolution: InviteConflictResolutionEnum = (req.query as any).inviteConflictResolution;

    try {
      await Promise.all(rows.map(this.validateWrapper));
      const dtos: CreateEmployeeDto[] = rows.map(bulkCreateEmployeeItemToCreateEmployeeDtoTransformer);

      employees = await Promise.all(dtos.map((dto) => this.inviteService.create(
        user,
        dto,
        businessId,
        true,
        inviteConflictResolution,
      )));

      return res.status(HttpStatus.OK).send(employees);
    } catch (e) {
      res.status(e?.response?.status || HttpStatus.INTERNAL_SERVER_ERROR).send(e?.response?.data || e?.response || e);
    }
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, description: 'Employee updated' })
  @Acl({ microservice: 'settings', action: AclActionsEnum.update })
  public async update(
    @User() user: UserTokenInterface,
    @Param('businessId') businessId: string,
    @ParamModel(':id', EmployeeSchemaName, true) employee: Employee,
    @Body() dto: UpdateEmployeeDto,
    @Req() request: fastify.FastifyRequest,
  ): Promise<Employee> {
    EmployeeService.checkAccess(employee, businessId);

    let customAccess: boolean = false;
    if (request.headers.access || (request.query as any).access) {
      customAccess = true;
    }

    EmployeeService.checkUpdatedEmployeeInfo(dto, employee);
    
    return this.employeeService.update(user, businessId, employee, dto, customAccess);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, description: 'Employee has been removed from a business' })
  @Acl({ microservice: 'settings', action: AclActionsEnum.delete })
  public async delete(
    @User() user: UserTokenInterface,
    @Param('businessId') businessId: string,
    @ParamModel(':id', EmployeeSchemaName, true) employee: Employee,
  ): Promise<Employee> {
    EmployeeService.checkAccess(employee, businessId);

    if (!user.isOwner) {
      await this.employeeService.canDeleteEmployee(user, employee, businessId);
    }

    return this.employeeService.removeEmployeeFromBusiness(employee, businessId);
  }

  private validateWrapper(item: any): Promise<void> {
    return validateOrReject(item, {
      whitelist: true,
    });
  }

  private async getParsedCsv(req: fastify.FastifyRequest): Promise<BulkCreateEmployeeRowDto[]> {
    const uploadedFile: Multipart<true> = await req.file();

    // tslint:disable-next-line: typedef
    return new Promise((resolve, reject) => {
      const result: BulkCreateEmployeeRowInterface[] = [];
      uploadedFile.file
        .pipe(csv())
        .on('data', (chunk: BulkCreateEmployeeRowInterface) => result.push(chunk))
        .on('end', () => {
          const typedResult: BulkCreateEmployeeRowDto[] = result.map(
            (plain: BulkCreateEmployeeRowInterface) => plainToClass(BulkCreateEmployeeRowDto, plain),
          );
          resolve(typedResult);
        })
        .on('error', reject);
    });
  }
}
