
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { SubscribersGroupBaseDto } from './subscribers-group.dto';

export class SubscribersGroupHttpResponseDto extends SubscribersGroupBaseDto {
  @ApiProperty()
  @IsString()
  public readonly _id: string;
}
