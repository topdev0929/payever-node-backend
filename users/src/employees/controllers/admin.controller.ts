import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  JwtAuthGuard,
  ParamModel,
  Roles,
  RolesEnum,
  User,
  UserTokenInterface,
} from '@pe/nest-kit';

import { CreateEmployeeDto, UpdateEmployeeDto } from '../dto';
import { Employee } from '../interfaces';
import { EmployeeSchemaName } from '../schemas';
import { EmployeeService, InvitationService } from '../services';
import { EmployeeFilterInterface } from '../interfaces/employee-filter.interface';
import { EmployeeSearchInterface } from '../interfaces/employee-search.interface';
import { EmployeeOrderInterface } from '../interfaces/employee-order.interface';
import { EmployeeListingDto } from '../dto/employee-listing.dto';
import { FilterCollector } from '../helper/filter';
import { InfoTransformPipe } from '../pipes';

const INVALID_CREDENTIALS_MESSAGE: string = 'Invalid credentials';

@Controller('admin/employees/:businessId')
@ApiTags('admin')
@ApiBearerAuth()
@UsePipes(InfoTransformPipe)
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
export class AdminController {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly inviteService: InvitationService,
    private readonly filterCollector: FilterCollector,
  ) { }

  @Get('')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, description: 'Employees list' })
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

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, description: 'Employees list' })
  public async get(
    @Param('businessId') businessId: string,
    @ParamModel(':id', EmployeeSchemaName, true) employee: Employee,
  ): Promise<{ data: Employee }> {
    EmployeeService.checkAccess(employee, businessId);

    return { data: employee };
  }

  @Get('/count')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, description: 'Employees count' })
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
  public async create(
    @User() user: UserTokenInterface,
    @Param('businessId') businessId: string,
    @Body() dto: CreateEmployeeDto,
  ): Promise<Employee> {
    return this.inviteService.create(user, dto, businessId);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, description: 'Employee updated' })
  public async update(
    @User() user: UserTokenInterface,
    @Param('businessId') businessId: string,
    @ParamModel(':id', EmployeeSchemaName, true) employee: Employee,
    @Body() dto: UpdateEmployeeDto,
  ): Promise<Employee> {
    EmployeeService.checkAccess(employee, businessId);

    return this.employeeService.update(user ,businessId, employee, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, description: 'Employee has been removed from a business' })
  public async delete(
    @Param('businessId') businessId: string,
    @ParamModel(':id', EmployeeSchemaName, true) employee: Employee,
  ): Promise<Employee> {
    EmployeeService.checkAccess(employee, businessId);

    return this.employeeService.removeEmployeeFromBusiness(employee, businessId);
  }
}
