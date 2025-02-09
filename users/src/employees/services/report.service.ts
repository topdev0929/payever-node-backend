import { Injectable, BadRequestException, HttpService } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { BulkImportDocument, Report, ReportDetail, ReportDocument, Task } from '../schemas';
import { BulkImportService } from './bulk-import.service';
import { ReportDetailService } from './report-detail.service';
import { Employee, PositionInterface, ValidateInstructionResultDataInterface } from '../interfaces';
import { pick, isMatch } from 'lodash';
import { environment } from '../../environments';
import { TaskService } from './task.service';
import { EventsProducer } from '../producer';
import { RabbitMessagesEnum, Status } from '../enum';
import { TokenResultDto } from '../dto';
import { ProcessingStatus } from '../enum/processing-status.enum';
import { EmployeeService } from './employee.service';
import { AclInterface } from '@pe/nest-kit';

type Handler = (task: Task, report?: Report, token?: string) => Promise<ValidateInstructionResultDataInterface>;
@Injectable()
export class ReportService {

  private validationHandlers: { [key: string]: Handler } = {
    user: this.userValidationHandler,
    auth: this.authValidationHandler,
    mailer: this.mailerValidationHandler,
  };

  constructor(
    @InjectModel(Report.name) private readonly reportModel: Model<ReportDocument>,
    private readonly employeeService: EmployeeService,
    private readonly httpService: HttpService,
    private readonly bulkImportService: BulkImportService,
    private readonly taskService: TaskService,
    private readonly reportDetailService: ReportDetailService,
    private readonly eventsProducer: EventsProducer,
  ) {
   }

  public async findById(id: string): Promise<ReportDocument> {
    return  this.reportModel.findById(id);
  }

  public async initReport(bulkImportId: string, token: string, userAgent: string): Promise<{ reportId: string }> {
    const bulkImportDocument: BulkImportDocument = await this.bulkImportService.findById(bulkImportId);
    if (!bulkImportDocument) {
      throw new BadRequestException('Given bulk import id does not exists.');
    }
    const latestReport: ReportDocument = await this.findById(bulkImportDocument.latestReport);
    const doneReportDetails: number = await this.reportDetailService.countDone(bulkImportDocument.latestReport);
    const tasks: Task[] = await this.taskService.findByBulkImportId(bulkImportId);

    if (latestReport && tasks.length > doneReportDetails) {
      throw new BadRequestException(`Report is already processing, ReportId ${bulkImportDocument.latestReport}`);
    }

    const newReport: ReportDocument = await this.reportModel.create({ bulkImportId, token, userAgent });
    await this.bulkImportService.updateLatestReport(bulkImportId, newReport._id);

    await this.eventsProducer.sendMessage({ reportId: newReport._id }, RabbitMessagesEnum.GenerateReport); 

    return {
      reportId: newReport._id,
    };
  }

  public async generateReport(reportId: string): Promise<void> {
    const report: Report = await this.reportModel.findById(reportId);
    const businessIds: string[] = await this.taskService.getDistinctBusinesses(report.bulkImportId);

    for (const businessId of businessIds) {
      await this.generateTaskReportByBusiness(report, businessId);
    }
  }

  public async delete(reportId: string): Promise<Report> {
    return this.reportModel.findByIdAndDelete(reportId);
  }

  private async generateTaskReportByBusiness(report: Report, businessId: string): Promise<void> {
    const tasks: Task[] = await this.taskService.findBy({ businessId, bulkImportId: report.bulkImportId });
    const businessToken: string = await this.getBusinessToken(report, businessId);

    for (const task of tasks) {
      await this.validateTask(task, report, businessToken);
    }
  }

  private async validateTask(task: Task, report: Report, businessToken: string): Promise<void> {
    const reportDetail: Omit<ReportDetail, '_id'> = {
      status: ProcessingStatus.InProcess,
      task: task._id,
      report: report._id,
      error: {},
      resultData: {},
    };

    let valid: boolean = true;

    for (const handlerName of Object.keys(this.validationHandlers)) {
      try {
        const handler: Handler = this.validationHandlers[handlerName];
        if (handler) {
          const result: ValidateInstructionResultDataInterface = await handler.call(this, task, report, businessToken);
          reportDetail.resultData[handlerName] = result;
          valid = result.valid && valid;
        }
      } catch (err) {
        reportDetail.error[handlerName] = {
          message: err.message,
          stack: err.stack,
        };
        reportDetail.status = ProcessingStatus.Error;
      }
    }

    if (reportDetail.status === ProcessingStatus.InProcess) {
      reportDetail.status = ProcessingStatus.Finished;
    }

    reportDetail.valid = valid;
    await this.reportDetailService.create(reportDetail);
  }

  private async userValidationHandler(
    task: Task, 
  ): Promise<ValidateInstructionResultDataInterface> {
    const employee: Employee = await this.employeeService.findOneBy({ _id: task.employeeId });

    const employeePosition: PositionInterface = employee.positions.find(
      (position: PositionInterface) => position.businessId === task.businessId,
    );

    const expected: any = {
      ...pick(
        task.incomingData, 
        ['firstName', 'lastName', 'address', 'email'],
      ),
      position: {
        businessId: task.businessId,
        positionType: task.incomingData.position,
        ...( employeePosition.status === Status.active ? { } : { status: Status.invited } ),
      },
    };

    const actual: any = {
      ...pick(
        task.incomingData, 
        ['firstName', 'lastName', 'address', 'email'],
      ),
      position: employeePosition,
    };

    return {
      expected,
      actual,
      valid: isMatch(actual, expected),
    };
  }

  private async authValidationHandler(
    task: Task, 
    report?: Report,
    token?: string,
  ): Promise<ValidateInstructionResultDataInterface> {
    const aclResponse: AxiosResponse<{ acls: AclInterface[]; positions: PositionInterface[] }> = 
    await this.httpService.get<{ acls: AclInterface[]; positions: PositionInterface[] }>(
      `${environment.authUrl}/api/employees/business/${task.businessId}/get-acls/${task.employeeId}`,
      this.getAxiosRequestConfig(report, token),
    ).toPromise(); 

    const employeePosition: PositionInterface = aclResponse.data.positions.find(
      (position: PositionInterface) => position.businessId === task.businessId,
    );

    const expected: any = {
      acls: aclResponse.data.acls,
      position: {
        businessId: task.businessId,
        positionType: task.incomingData.position,
        ...( employeePosition.status === Status.active ? { } : { status: Status.invited } ),
      },
    };

    const actual: any = {
      acls: task.incomingData.acls,
      position: {
        businessId: task.businessId,
        positionType: task.incomingData.position,
        ...( employeePosition.status === Status.active ? { } : { status: Status.invited } ),
      },
    };

    return {
      expected,
      actual,
      valid: isMatch(actual, expected),
    };
  }

  private async mailerValidationHandler(task: Task): Promise<ValidateInstructionResultDataInterface> {
    const employee: Employee = await this.employeeService.findOneBy({ _id: task.employeeId });

    const employeePosition: PositionInterface = employee.positions.find(
      (position: PositionInterface) => position.businessId === task.businessId,
    );

    const actual: any = { inviteMailSent: !!employeePosition.inviteMailSent };
    const expected: any = { inviteMailSent: true };

    return {
      expected,
      actual,
      valid: isMatch(actual, expected),
    };
  }

  private async getBusinessToken(report: Report, businessId: string): Promise<string> {
    const businessSpecificToken: AxiosResponse<TokenResultDto> = await this.httpService.patch<TokenResultDto>(
      `${environment.authUrl}/api/business/${businessId}/enable`,
      { },
      this.getAxiosRequestConfig(report),
    ).toPromise();  

    return businessSpecificToken.data.accessToken;
  }

  private getAxiosRequestConfig(report: Report, token?: string): AxiosRequestConfig {
    return {
      headers: {
        Authorization: `Bearer ${token || report.token}`,
        'User-Agent': report.userAgent,
      },
    };
  }

}
