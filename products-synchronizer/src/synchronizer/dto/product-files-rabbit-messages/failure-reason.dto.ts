import { IsString, IsNotEmpty } from 'class-validator';

export class FailureReasonDto {
  @IsString()
  @IsNotEmpty()
  public errorMessage: string;
}
