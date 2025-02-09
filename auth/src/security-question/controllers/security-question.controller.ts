import {
  Body, Controller, HttpCode,
  HttpStatus, Post, UseGuards,
  Req, Res, Delete, Get,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, Roles, RolesEnum, TokensResultModel, User, UserTokenInterface } from '@pe/nest-kit';

import { FastifyRequestWithIpInterface, RefreshPayload } from '../../auth/interfaces';
import { SecurityQuestionDto, SecurityQuestionResponseDto, ValidateSecurityQuestionDto } from '../dto';
import { SecurityQuestionService } from '../services';
import { TokenCookieWriter } from '../../common';
import { FastifyResponse } from '../../common/interfaces';

const accessGrantedDescription: string = 'Access granted';
const invalidCredentialDescription: string = 'Invalid credentials';
@Controller('api/security-question')
@ApiTags('security question')
export class SecurityQuestionController {
  constructor(
    private readonly securityQuestionService: SecurityQuestionService,
    private readonly tokenCookieWriter: TokenCookieWriter,

  ) { }

  @Get('')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Roles(RolesEnum.user)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: invalidCredentialDescription })
  @ApiResponse({ status: HttpStatus.OK, description: 'Security questions list' })
  public async getQuestions(): Promise<string[]> {
    return this.securityQuestionService.getQuestions();
  }

  @Get('/question')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('refresh'))
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: invalidCredentialDescription })
  @ApiResponse({ status: HttpStatus.OK, description: 'Security question for user' })
  public async getUserSecurityQuestion(
    @User() refreshTokenPayload: RefreshPayload,
  ): Promise<SecurityQuestionResponseDto> {
    return this.securityQuestionService.getRelatedQuestionByUserId(refreshTokenPayload.payload.userId);
  }

  @Post('validate')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('refresh'))
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: invalidCredentialDescription })
  @ApiResponse({ status: HttpStatus.OK, description: accessGrantedDescription })
  public async validateAnswer(
    @User() refreshTokenPayload: RefreshPayload,
    @Body() dto: ValidateSecurityQuestionDto,
    @Req() request: FastifyRequestWithIpInterface,
    @Res() response: FastifyResponse,
  ): Promise<void> {
    dto.tokenId = refreshTokenPayload.payload.tokenId;
    const tokenObject: TokensResultModel = await this.securityQuestionService.validate(dto, request);
    this.tokenCookieWriter.setTokenToCookie(
      response,
      tokenObject,
    );
    response.status(HttpStatus.OK).send(tokenObject);
  }

  @Post('define')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Roles(RolesEnum.user)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: invalidCredentialDescription })
  @ApiResponse({ status: HttpStatus.OK, description: 'Security question defined' })
  public async defineSecurityQuestion(
    @User() user: UserTokenInterface,
    @Body() dto: SecurityQuestionDto,
  ): Promise<void> {
    dto.userId = user.id;
    await this.securityQuestionService.defineSecurityQuestion(dto);
  }

  @Delete('undefine')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Roles(RolesEnum.user)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: invalidCredentialDescription })
  @ApiResponse({ status: HttpStatus.OK, description: 'Security question removed' })
  public async unDefineSecurityQuestion(
    @User() user: UserTokenInterface,
  ): Promise<void> {
    await this.securityQuestionService.unDefineSecurityQuestion(user.id);
  }
}
