import { Field, InterfaceType } from '@nestjs/graphql';
import { PagingDataDto } from './pagination-data.dto';

@InterfaceType()
export abstract class BasePagingResultDto {
  public collection: any[];

  @Field(() => PagingDataDto)
  public pagination_data: PagingDataDto;
}
