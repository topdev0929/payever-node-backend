import { Controller, Get, Param } from '@nestjs/common';
import { DefaultStepService } from '../services';
import { SectionsEnum } from '../enums';
import { DefaultStepModel } from '../models';

@Controller('/stepper/steps')
export class DefaultStepController {
  constructor(
    private readonly defaultStepService: DefaultStepService,
  ) { }

  @Get('/:sectionName')
  public async list(
    @Param('sectionName') sectionName: SectionsEnum,
  ): Promise<DefaultStepModel[]> {
    return this.defaultStepService.getListForSection(sectionName);
  }
}
