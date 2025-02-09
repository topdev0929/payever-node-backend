import { BadRequestException, Controller, Get, Param, Query, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { SlugParser } from '../helpers';
import { ParsedSlug } from '../interfaces';
import { RedirectUrlGenerator } from '../services';

@ApiTags('pay/init')
@Controller('pay/init')
@ApiBearerAuth()
export class SlugController {
  constructor(
    private readonly redirectUrlGenerator: RedirectUrlGenerator,
  ) { }

  @Get('*')
  public async redirectSlugChannelSet(
    @Param() params: string[],
    @Query() query: { [key: string]: string },
    @Res() res: FastifyReply<any>,
  ): Promise<void> {
    const slug: string = params['*'];

    if (!slug) {
      throw new BadRequestException('No shop identifier has been provided in this url');
    }

    const parsedSlug: ParsedSlug = SlugParser.parse(slug);

    res.redirect(302, await this.redirectUrlGenerator.generate(parsedSlug, query));
  }
}
