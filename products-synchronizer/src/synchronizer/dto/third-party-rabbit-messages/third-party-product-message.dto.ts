import { ValidateNested, IsDefined, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { BusinessDto } from '../';
import { IntegrationNameReferenceDto } from '../integration-name-reference.dto';
import { ProductDto } from '../products';
import { ThirdPartySyncTaskMessageDto } from './third-party-sync-task-message.dto';
import { isString } from 'fp-ts/lib/string';

export class ThirdPartyProductMessageDto {
  @ValidateNested()
  @IsDefined()
  @Type(() => BusinessDto)
  public business: BusinessDto;

  @ValidateNested()
  @IsDefined()
  @Type(() => IntegrationNameReferenceDto)
  public integration: IntegrationNameReferenceDto;

  @IsDefined()
  @Type(() => ProductDto)
  public data: ProductDto[];

  @IsOptional()
  public synchronization: ThirdPartySyncTaskMessageDto;

  @IsString()
  @IsDefined()
  public routingKey: string;

}
