import { IsString, IsNotEmpty } from 'class-validator';

export class CreateBusinessReportResponseDto implements CreateBusinessReportResponseItemInterface {
  @IsString()
  @IsNotEmpty()
  public business: string;

  @IsString()
  public email: string;

  @IsString()
  public firstName: string;
}

export interface CreateBusinessReportResponseItemInterface {
  business: string;
  email: string;
  firstName: string;
}
