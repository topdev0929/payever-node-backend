import { InputType } from 'type-graphql';
import { ContactClass } from './contact.class';

@InputType()
export class ContactSetClass implements Partial<ContactClass> {
}
