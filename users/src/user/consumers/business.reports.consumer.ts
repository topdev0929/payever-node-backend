import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { validate } from 'class-validator';
import { CreateBusinessReportRequestDto, CreateBusinessReportResponseDto } from '../dto';
import { UserInterface } from '../interfaces';
import { BusinessModel } from '../models';
import { UserEventsProducer } from '../producers';
import { BusinessService } from '../services';

@Controller()
export class BusinessReportsConsumer {
  constructor(
    private readonly businessService: BusinessService,
    private readonly userEventsProducer: UserEventsProducer,
  ) { }

  @MessagePattern({
    name: 'mailer-report.event.report-data.requested',
  })
  public async onMailerReportRequestedEvent(createBusinessReportDto: CreateBusinessReportRequestDto): Promise<void> {
    await validate(createBusinessReportDto);

    const data: CreateBusinessReportResponseDto[] = [];

    for (const businessId of createBusinessReportDto.businessIds) {
      const business: BusinessModel = await this.businessService.findBusiness(businessId);
      if (!business) {
        continue;
      }

      await business.populate('owner').execPopulate();
      const user: UserInterface = business.owner as UserInterface;
      if (user && user.userAccount) {
        data.push({
          business: businessId,
          email: user.userAccount.email,
          firstName: user.userAccount.firstName,
        });
      } else {
        data.push({
          business: businessId,
          email: '',
          firstName: '',
        });
      }
    }

    await this.userEventsProducer.produceUserReportDataPreparedEvent(data);
  }
}
