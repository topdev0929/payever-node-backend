import { CompanyDetailsInterface } from '@pe/business-kit';
import { CreateContactRBMQDto } from 'src/appointments/dto';

export const ContactStub: CreateContactRBMQDto = {
    email: 'test@test.com',
    firstName: 'test',
    lastName: 'test',
    mobilePhone: '123456789',
};
