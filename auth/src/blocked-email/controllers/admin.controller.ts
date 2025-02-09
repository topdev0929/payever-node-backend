import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit';
import { BlockEmailService } from '../services';
import { BlockEmailDto } from '../dto';
import { BlockEmailModel } from '../models';

const accessGrantedDescription: string = 'Access granted';

@Controller('api/admin/block-email')
@ApiTags('admin')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
export class AdminController {
  constructor(
    private readonly blockEmailService: BlockEmailService,
  ) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid credentials' })
  @ApiResponse({ status: HttpStatus.OK, description: accessGrantedDescription })
  public async getList(): Promise<BlockEmailModel[]> {
    return this.blockEmailService.find({ });
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid credentials' })
  @ApiResponse({ status: HttpStatus.OK, description: accessGrantedDescription })
  public async edit(@Body() dto: BlockEmailDto): Promise<BlockEmailModel> {
    return this.blockEmailService.create(dto as any);
  }
}
