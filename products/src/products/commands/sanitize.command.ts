
import { Collection } from 'mongodb';
import { Model } from 'mongoose';
import * as sanitizer from 'sanitize-html';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Command, Positional } from '@pe/nest-kit';

import { ProductModel } from '../models';
import { ProductInterface } from '../interfaces';

@Injectable()
export class SanitizeCommand {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<ProductModel>,
  ) { }

  @Command({
    command: 'sanitize <collection> <field>',
    describe: 'Sanitize text fields to be html-safe',
  })
  public async sanitize(
    @Positional({
      name: 'collection',
    }) collectionName: string,
    @Positional({
      name: 'field',
    }) fieldName: string,
  ): Promise<void> {
    const docs = [];
    const collection: Collection<ProductModel> = this.productModel.db.collection(collectionName);
    await collection.find({ }).forEach((doc: ProductModel) => {
      if (typeof doc[fieldName] !== 'string') { return; }
      docs.push(doc);
    });
    for (const doc of docs) {
      await collection.updateOne(
        { _id: doc._id },
        { $set: { [fieldName]: sanitizer(doc[fieldName]) } });
    }
  }
}
