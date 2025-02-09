import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Acl, AclActionsEnum, JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit';
import { SectionInterface } from '../interfaces';
import { SectionModel } from '../models';
import { SectionsService } from '../services';

@Controller('sections')
@ApiTags('sections')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) { }

  @Post()
  @Roles(RolesEnum.admin)
  public async createSection(
    @Body() saveSectionsDto: SectionInterface,
  ): Promise<void> {
    await this.sectionsService.createSection(saveSectionsDto);
  }

  @Get()
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'checkout', action: AclActionsEnum.read })
  public async getAllSections(): Promise<SectionModel[]> {
    return this.sectionsService.findAll();
  }
}
