import {
  Controller,
  Get,
  Param,
  Body,
  HttpStatus,
  Query,
  Post,
  HttpCode,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { OnboardingDto } from '../dto';
import { OnboardingManager } from '../services';
import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit';
import { OnboardingRequestDto } from '../dto/onboarding-request.dto';
import { DEFAULT_ONBOARDING_NAME } from '../constants';

@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.anonymous)
@ApiTags('Onboarding')
@Controller('onboarding')
export class OnboardingController {
  constructor(
    private readonly onboardingManager: OnboardingManager,
  ) { }

  @Get('/:name')
  @ApiResponse({ type: OnboardingDto, status: HttpStatus.OK})
  public async getPartner(
    @Param('name') name: string,
  ): Promise<OnboardingDto> {
    const onboardingRequest: OnboardingRequestDto = {
      name,
    };

    return this.getPartnerPayload(onboardingRequest);
  }

  @Post('')
  @ApiResponse({ type: OnboardingDto, status: HttpStatus.OK})
  public async getPartnerPayload(
    @Body() onboardingRequest: OnboardingRequestDto,
  ): Promise<OnboardingDto> {
    if (!onboardingRequest.name) {
      onboardingRequest.name = DEFAULT_ONBOARDING_NAME;
    }
    const onboarding: OnboardingDto = await this.onboardingManager.getPartner(onboardingRequest);

    return onboarding ? onboarding : this.onboardingManager.getDefaultPartner(onboardingRequest);
  }

  @Get('cached/:name')
  @ApiResponse({ type: OnboardingDto, status: HttpStatus.OK})
  public async getCachedPartner(
    @Param('name') name: string,
  ): Promise<OnboardingDto> {
    const onboardingRequest: OnboardingRequestDto = {
      name,
    };

    return this.getCachedPartnerPayload(onboardingRequest);
  }

  @Post('cached')
  @ApiResponse({ type: OnboardingDto, status: HttpStatus.OK})
  public async getCachedPartnerPayload(
    @Body() onboardingRequest: OnboardingRequestDto,
  ): Promise<OnboardingDto> {
    if (!onboardingRequest.name) {
      onboardingRequest.name = DEFAULT_ONBOARDING_NAME;
    }

    return this.onboardingManager.getCachedOnboarding(onboardingRequest);
  }

  @Post('/update-cache')
  @Roles(RolesEnum.admin)
  @ApiResponse({ type: OnboardingDto, status: HttpStatus.ACCEPTED})
  @HttpCode(HttpStatus.ACCEPTED)
  public async updatePartnerCache(
  ): Promise<void> {
    await this.onboardingManager.updatePartnerCache();
  }

  @Get('redirect-to-partner/business/:businessId/integration/:integration')
  @ApiResponse({ status: HttpStatus.OK})
  public async redirectToPartner(
    @Param('businessId') businessId: string,
    @Param('integration') name: string,
    @Query('redirectUrl') redirectUrl: string,
  ): Promise<{ }> {
    const frontRedirectedUrl: string =
      await this.onboardingManager.getPartnerRedirectedUrl(businessId, name, redirectUrl);

    if (!frontRedirectedUrl) {
      throw new HttpException('Can\'t get redirect url', HttpStatus.PRECONDITION_FAILED);
    }

    return {
      redirectUrl: frontRedirectedUrl,
    };
  }

}
