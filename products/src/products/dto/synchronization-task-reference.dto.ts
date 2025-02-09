import { IsString, IsBoolean, IsOptional, IsNotEmpty } from 'class-validator';

export class SynchronizationTaskReferenceDto {
  @IsString()
  @IsNotEmpty()
  public id: string;

  @IsBoolean()
  @IsOptional()
  public isFinished?: boolean;
}
