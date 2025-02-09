import { IsNotEmpty, IsString } from 'class-validator';

export class SynchronizationTaskReferenceDto {
  @IsString()
  @IsNotEmpty()
  public id: string;
}
