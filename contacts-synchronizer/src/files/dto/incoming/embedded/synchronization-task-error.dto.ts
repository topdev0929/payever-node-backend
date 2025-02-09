import { IsString, IsOptional, IsArray, IsNotEmpty } from 'class-validator';

export class SynchronizationTaskErrorDto {
  @IsString()
  @IsOptional()
  public email?: string;
  @IsArray()
  @IsNotEmpty()
  public messages: string[];
}
