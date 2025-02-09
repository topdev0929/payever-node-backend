import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApplicationAccessStatusEnum } from '@pe/nest-kit/modules/auth/enums';

@Expose()
export class UpdateApplicationAccessRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID('4')
  public applicationId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public type: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID('4')
  public userId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum([ApplicationAccessStatusEnum.APPROVED, ApplicationAccessStatusEnum.DENIED])
  public status: ApplicationAccessStatusEnum.APPROVED | ApplicationAccessStatusEnum.DENIED;
}
