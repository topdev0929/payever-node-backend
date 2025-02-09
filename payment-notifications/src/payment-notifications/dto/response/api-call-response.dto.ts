import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ApiCallResponseDto {
  @ApiProperty()
  @IsString()
  @Expose()
  public id: string;

  @ApiProperty()
  @IsString()
  @Expose()
  public successUrl?: string;

  @ApiProperty()
  @IsString()
  @Expose()
  public pendingUrl?: string;

  @ApiProperty()
  @IsString()
  @Expose()
  public failureUrl?: string;

  @ApiProperty()
  @IsString()
  @Expose()
  public cancelUrl?: string;

  @ApiProperty()
  @IsString()
  @Expose()
  public noticeUrl?: string;

  @ApiProperty()
  @IsString()
  @Expose()
  public customerRedirectUrl?: string;
}
