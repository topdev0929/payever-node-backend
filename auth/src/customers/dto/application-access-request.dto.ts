import { ApiProperty } from '@nestjs/swagger';
import { ApplicationAccessInterface, ApplicationAccessStatusEnum } from '@pe/nest-kit';

export class ApplicationAccessRequestDto implements ApplicationAccessInterface {
  @ApiProperty()
  public userId: string;

  @ApiProperty()
  public applicationId: string;

  @ApiProperty()
  public businessId: string;

  @ApiProperty()
  public type: string;

  @ApiProperty({ enum: ApplicationAccessStatusEnum })
  public status: ApplicationAccessStatusEnum;
}
