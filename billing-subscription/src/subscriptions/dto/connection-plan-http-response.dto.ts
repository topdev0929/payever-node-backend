
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ConnectionPlanHttpBasetDto } from './connection-plan.dto';

export class ConnectionPlanHttpResponseDto extends ConnectionPlanHttpBasetDto {
  @ApiProperty()
  @IsNotEmpty()
  public readonly _id: string;
}
