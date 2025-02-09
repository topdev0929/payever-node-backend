import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class StatusDto {
  @IsString()
  @IsNotEmpty()
  public general: string;

  @IsString()
  @IsOptional()
  public specific?: string;
}
