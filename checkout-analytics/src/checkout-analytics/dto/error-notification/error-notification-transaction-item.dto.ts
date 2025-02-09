import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ErrorNotificationTransactionItemDto {
  @ApiProperty()
  @Expose()
  public errorDetails: any;

  @ApiProperty()
  @IsString()
  @Expose()
  public integration: string;
}
