/* eslint-disable max-classes-per-file */
import { IsString, IsEnum, IsNotEmpty } from 'class-validator';
import {
  ArgumentMediaContainerEnum,
  ArgumentMediaContainerEnumObject,
} from '../../media/enum';

export class ContainerDto {
  @IsNotEmpty()
  @IsEnum(ArgumentMediaContainerEnumObject)
  public container: ArgumentMediaContainerEnum;
}

export class ContainerWithBlobNameDto extends ContainerDto {
  @IsNotEmpty()
  @IsString()
  public blobName: string;
}

export class UploadMediaDto extends ContainerDto {
  @IsNotEmpty()
  @IsString()
  public businessId: string;
}

export class UploadMediaWithBlobNameDto extends ContainerDto {
  @IsNotEmpty()
  @IsString()
  public businessId: string;

  @IsNotEmpty()
  @IsString()
  public blobName: string;
}

export class GetByApplicationDto extends ContainerDto {
  @IsNotEmpty()
  @IsString()
  public applicationId: string;
}

export class ChangeContainerByApplicationDto extends ContainerDto {
  @IsNotEmpty()
  @IsString()
  public businessId: string;

  @IsNotEmpty()
  @IsString()
  public applicationId: string;
}
