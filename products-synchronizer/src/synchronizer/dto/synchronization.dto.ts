import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class SynchronizationDto {
  @IsString()
  @IsNotEmpty()
  public taskId: string;

  @IsBoolean()
  @IsOptional()
  public isFinished?: boolean;
}
