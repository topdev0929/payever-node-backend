import { UseFilters } from '@nestjs/common';
import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { AbstractGqlResolver } from '@pe/graphql-kit';

import { AppointmentField, Field, AppointmentFieldDocument } from '../../schemas';
import { ServiceExceptionFilter } from '../../../common/service.exception.filter';

@Resolver(() => AppointmentField)
@UseFilters(ServiceExceptionFilter)
export class AppointmentFieldResolver extends AbstractGqlResolver {
  @ResolveField()
  public async field(
    @Parent() appointmentField: AppointmentFieldDocument,
  ): Promise<Field> {
    await appointmentField
      .populate('field')
      .execPopulate();

    return appointmentField.field;
  }
}
