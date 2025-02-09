import { ApiResponseProperty } from '@nestjs/swagger';
import { VerificationType } from '../../enum';

export class BusinessSetingResponseDto {
  @ApiResponseProperty()
  public secondFactor: boolean;

  @ApiResponseProperty()
  public enabled?: boolean;

  @ApiResponseProperty()
  public verificationType: VerificationType;

  @ApiResponseProperty()
  public autoresponderEnabled: boolean;
}
