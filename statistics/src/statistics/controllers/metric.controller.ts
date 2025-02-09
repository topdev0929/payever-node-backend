/* tslint:disable:no-duplicate-string*/
import { Controller, HttpCode, HttpStatus, UseGuards, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';
import { MetricDto } from '../dto';
import { MetricInterface } from '../interfaces';
import { BrowserModel, MetricModel } from '../models';
import { MetricService } from '../services';
import { Acl, AclActionsEnum } from '@pe/nest-kit';

@Controller('metric')
@ApiTags('metric')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid authorization token.' })
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
export class MetricController {
  constructor(
    private readonly metricService: MetricService,
  ) {
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    description: 'The records have been successfully fetched.',
    isArray: true,
    status: HttpStatus.OK,
    type: MetricDto,
  })
  @Acl({ microservice: 'statistics', action: AclActionsEnum.read })
  public async findAll(): Promise<Array<{
    list: MetricInterface[] | BrowserModel[];
    type: string;
  }>> {
    const metrics: MetricModel[] = await this.metricService.findAll();
    const result: Array<{
      list: MetricInterface[] | BrowserModel[];
      type: string;
    }> = [];
    metrics.forEach((j: MetricModel) => {
      const i: MetricInterface = j.toObject();
      const foundIndex: number = result.findIndex((a: any) => a.type === i.group);
      if (foundIndex >= 0) {
        result[foundIndex].list.push(i as any);
      } else {
        result.push({
          list: [i],
          type: i.group,
        });
      }
    });

    result.push({
      list: await this.metricService.findBrowserAll(),
      type: 'BrowserFilter',
    });

    return result;
  }
}
