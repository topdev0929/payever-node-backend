import {
  Body,
  Controller,
  Post,
  HttpStatus,
  HttpCode,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OAuthClient, OAuthService } from '../../oauth';
import { OrganizationTokenRequestDto } from '../dto';
import { OrganizationService } from '../services';

@Controller('api/organizations')
@ApiTags('organization')
export class OrganizationController {
  constructor(
    private readonly organizationService: OrganizationService,
    @Inject(forwardRef(() => OAuthService))
    private readonly oauthService: OAuthService,
  ) { }

  @Post('token')
  @HttpCode(HttpStatus.OK)
  public async generateNewToken(
    @Body() dto: OrganizationTokenRequestDto,
  ): Promise<any> {
    const client: OAuthClient = await this.oauthService.findByIdClientIdAndSecret(dto.clientId, dto.clientSecret);

    return this.organizationService.generateNewToken(client, dto);
  }
}
