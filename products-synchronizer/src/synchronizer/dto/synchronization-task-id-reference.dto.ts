import { IsBoolean, IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class SynchronizationTaskIdReferenceDto {
  @IsString()
  @IsNotEmpty()
  public taskId: string;

  @IsBoolean()
  @IsOptional()
  public isFinished?: boolean;
}
