import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, Min, IsString, IsIn, IsDate, Max } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class ItemsQueryRequestDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  public orderBy?: string = 'created_at';
  
  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  public direction?: string = 'asc';
  
  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  @Transform((value: string) => {
    if (value) {
      return new Date(value);
    }
  }, { toClassOnly: true })
  public from?: Date;
  
  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  @Transform((value: string) => {
    if (value) {
      return new Date(value);
    }
  }, { toClassOnly: true })
  public to?: Date;
  
  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  public page?: number = 1;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  public limit?: number = 10;

  @ApiProperty({ required: false })
  @IsOptional()
  public projection?: any;

}
