import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LinksMaskingIngressDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  public pageLinks: Array<{
    applicationId: string;
    maskingPath: string;
    targetApp: string;
    targetDomain: string;
  }>;
}
