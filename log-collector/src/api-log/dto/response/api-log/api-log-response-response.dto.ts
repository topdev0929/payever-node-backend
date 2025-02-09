export class ApiLogResponseDto {
  public logId: string;
  public serviceName: string;
  public timestamp: string;
  public url: string;
  public httpMethod: string;
  public httpCode: number;
  public correlationID: string;
  public ip: string;
  public apiVersion: string;
  public source: string;
  public origin: string;
  public idempotencyKey: string;
  public requestBody: any;
  public responseBody: any;
  public error: any;
}
