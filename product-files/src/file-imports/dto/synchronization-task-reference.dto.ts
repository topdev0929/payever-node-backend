import { IsString, IsNotEmpty } from 'class-validator';

export class SynchronizationTaskReferenceDto {
  @IsString()
  @IsNotEmpty()
  public taskId: string;
}
