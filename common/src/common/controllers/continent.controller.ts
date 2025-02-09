import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ContinentDto, ContinentModel, ContinentService } from '@pe/common-sdk';

@Controller('continent')
@ApiTags('Continents API reference')
export class ContinentController {

  constructor(
    private readonly dataService: ContinentService,
  ) { }

  @Get('/list')
  @HttpCode(HttpStatus.OK)
  public async list(): Promise<ContinentDto[]> {
    const list: ContinentModel[] = await this.dataService.findAll();

    return Promise.all(
      list.map((item: ContinentModel) => this.dataService.convertModelToDto(item)),
    );
  }
}
