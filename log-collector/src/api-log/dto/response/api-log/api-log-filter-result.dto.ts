import { ApiLogResponseDto } from './api-log-response-response.dto';

export class ApiLogFilterResultDto {
  public total: number;
  public totalPages: number;
  public page: number;
  public logs: ApiLogResponseDto[];
}
