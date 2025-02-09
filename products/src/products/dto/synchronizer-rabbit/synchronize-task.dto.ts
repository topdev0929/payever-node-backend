import { IsDefined, IsOptional } from 'class-validator';

export class SynchronizeTaskDto {
  @IsDefined()
  public taskId: string;

  @IsOptional()
  public isFinished?: boolean;
}
