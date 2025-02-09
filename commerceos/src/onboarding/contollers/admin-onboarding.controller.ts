import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { OnboardingDto } from '../dto';
import { UpdateOnboardingDto } from '../dto/update-unboarding.dto';
import { OnboardingModel } from '../models';
import { OnboardingSchemaName } from '../schemas';
import { OnboardingManager } from '../services';


const invalidAuthApi: any = { status: 400, description: 'Invalid authorization token.' };
const unauthorizedApi: any = { status: 401, description: 'Unauthorized.' };

@Controller('admin/onboarding')
@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
export class AdminOnboardingController {

  constructor(
    private readonly onboardingManager: OnboardingManager,
  ) { }

  @Get('list')
  @ApiResponse({
    isArray: true,
    status: 200,
    type: OnboardingDto,
  })
  @ApiBearerAuth()
  @ApiResponse(invalidAuthApi)
  @ApiResponse(unauthorizedApi)
  public async getAllOnboardings(): Promise<OnboardingDto[]> {
    return this.onboardingManager.getAll();
  }

  @Get(':name')
  @ApiResponse({ type: OnboardingDto, status: HttpStatus.OK })
  @ApiBearerAuth()
  @ApiResponse(invalidAuthApi)
  @ApiResponse(unauthorizedApi)
  public async getOneOnboarding(
    @ParamModel({ name: ':name' }, OnboardingSchemaName) onboarding: OnboardingModel,
    @Param('name') swagger__name: string,
  ): Promise<OnboardingDto> {
    return onboarding;
  }

  @Post()
  @ApiResponse({ type: OnboardingDto, status: HttpStatus.OK })
  @ApiResponse({ status: 400, description: '`name` should be unique.' })
  @ApiBearerAuth()
  @ApiResponse(invalidAuthApi)
  @ApiResponse(unauthorizedApi)
  public async createOnboarding(
    @Body() onboardingDto: OnboardingDto,
  ): Promise<OnboardingDto> {
    return this.onboardingManager.create(onboardingDto);
  }

  @Patch(':name')
  @ApiResponse({ type: OnboardingDto, status: HttpStatus.OK })
  @ApiBearerAuth()
  @ApiResponse(invalidAuthApi)
  @ApiResponse(unauthorizedApi)
  public async updateOnboarding(
    @Param('name') name: string,
    @Body() updateOnboardingDto: UpdateOnboardingDto,
  ): Promise<OnboardingDto> {
    return this.onboardingManager.update(name, updateOnboardingDto);
  }

  @Delete(':name')
  @ApiResponse({ type: OnboardingDto, status: HttpStatus.OK })
  @ApiBearerAuth()
  @ApiResponse(invalidAuthApi)
  @ApiResponse(unauthorizedApi)
  public async deleteOnboarding(
    @ParamModel({ name: ':name' }, OnboardingSchemaName) onboarding: OnboardingModel,
    @Param('name') swagger__name: string,
  ): Promise<OnboardingDto> {
    return this.onboardingManager.delete(onboarding);
  }

}
