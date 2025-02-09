import { AppointmentAvailability, AppointmentAvailabilityDocument } from '../schemas';
import { Field, ObjectType } from '@nestjs/graphql';
import { BasePagingResultDto } from '../../common';

@ObjectType( { implements: BasePagingResultDto } )
export class AvailabilityPagingResultDto extends BasePagingResultDto {
  @Field(() => [AppointmentAvailability])
  public collection: AppointmentAvailabilityDocument[];
}
