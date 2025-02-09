import { AppointmentType, AppointmentTypeDocument } from '../schemas';
import { Field, ObjectType } from '@nestjs/graphql';
import { BasePagingResultDto } from '../../common';

@ObjectType( { implements: BasePagingResultDto } )
export class TypePagingResultDto extends BasePagingResultDto {
  @Field(() => [AppointmentType])
  public collection: AppointmentTypeDocument[];
}
