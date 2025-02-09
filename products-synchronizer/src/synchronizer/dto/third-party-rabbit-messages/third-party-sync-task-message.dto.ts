import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class ThirdPartySyncTaskMessageDto {
  @IsString()
  @IsOptional()
  taskId: string;

  @IsBoolean()
  @IsOptional()
  isFinished: boolean;
}

