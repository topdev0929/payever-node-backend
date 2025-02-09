import { Schema, Document, Types } from 'mongoose';
import { Schema as SchemaDecorator, Prop, SchemaFactory } from '@nestjs/mongoose';

@SchemaDecorator()
export class Country {
  @Prop()
  public _id: string;
}

export interface CountryDocument extends Document<string>, Country {
  _id: string;
}

export const CountrySchema: Schema<CountryDocument> = SchemaFactory.createForClass(Country);

export const CountriesSchemaName: string = Country.name;
