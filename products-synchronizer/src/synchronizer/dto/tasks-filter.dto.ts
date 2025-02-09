import { IsOptional, IsString, IsIn } from 'class-validator';
import { SynchronizationDirectionEnum } from '../enums/synchronization-direction.enum';
import { SynchronizationStatusEnum } from '../enums/synchronization-status.enum';
import { SynchronizationTasKindEnum } from '../enums/synchronization-task-kind.enum';

export class TasksFilterDto {
  @IsOptional()
  @IsString()
  @IsIn(Object.values(SynchronizationDirectionEnum))
  public direction: string;

  @IsOptional()
  @IsString({ each: true })
  @IsIn(Object.values(SynchronizationStatusEnum), { each: true })
  public status: string[];

  @IsOptional()
  @IsString({ each: true })
  @IsIn(Object.values(SynchronizationTasKindEnum), { each: true })
  public kind: string[];
}
