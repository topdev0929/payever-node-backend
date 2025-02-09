import { Controller, BadRequestException, Get, HttpStatus, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles, RolesEnum } from '@pe/nest-kit';
import { PublicChannelSlugDto } from '../dto';
import axios from 'axios';

@Controller('get-meta')
@ApiTags('proxy/get-meta')
@Roles(RolesEnum.anonymous)
export class ProxyMetaController {
  @Get('')
  @ApiResponse({ status: HttpStatus.OK, type: PublicChannelSlugDto })
  public async getBySlug(
    @Query() query: { url: string },
  ): Promise<any> {
    try {
      const response: any = await axios.get(query.url);

      return response.data;
    } catch (error) {
      throw new BadRequestException(`The url address is not correct`);
    }
  }
}
