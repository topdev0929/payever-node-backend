import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { BusinessService, PaymentService, SenderService } from '../services';
import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit';
import { plainToClass } from 'class-transformer';
import { BusinessMailDto, IntegrationMailDto, JiraMailDto, MailDto } from '../dto';
import { MailerRolesEnum } from '../enum';
@Controller()
@UseGuards(JwtAuthGuard)
export class IntegrationMailController {
  constructor(
    private readonly logger: Logger,
    private readonly paymentService: PaymentService,
    private readonly businessService: BusinessService,
    private readonly senderService: SenderService,
  ) { }

  @Post('/business/integration/mail')
  @Roles(RolesEnum.anonymous)
  public async resendIntegrationPaymentMail(
    @Body() dto: IntegrationMailDto,
  ): Promise<void> {
    const business: any = await this.businessService.findOneById(dto.data.businessId);

    if (!business) {
      return ;
    }

    const businessMailDto: BusinessMailDto = plainToClass<BusinessMailDto, { }>(BusinessMailDto, {
      businessId: dto.data.businessId,
      subject: dto.data.subject,
      to: dto.data.to,
      variables: {
        html: dto.data?.body,
      },
    });

    return this.businessService.sendHtmlIntegrationMail(businessMailDto);
  }

  @Post('/integration/jira')
  @Roles(MailerRolesEnum.integration)
  public async integrationJiraMail(
    @Body() dto: JiraMailDto,
  ): Promise<void> {
    const mailDto: MailDto = new MailDto();

    Object.assign(mailDto, { to: dto.to, subject: dto.subject, headers: dto.headers });

    if (dto['reply-to']) {
      mailDto.replyTo = dto['reply-to'];
    }

    if (dto.body) {
      mailDto.html = dto.body;
    }

    await this.senderService.send(mailDto);
  }
}
