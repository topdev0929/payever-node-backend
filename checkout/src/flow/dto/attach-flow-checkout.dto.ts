import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

/** @deprecated */
export class AttachFlowCheckoutDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public checkoutUuid: string;
}
