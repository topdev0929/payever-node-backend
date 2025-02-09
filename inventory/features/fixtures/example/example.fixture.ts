import { BaseFixture } from '@pe/cucumber-sdk';

class ExampleFixture extends BaseFixture {
  public async apply(): Promise<void> {
    // const model: Model<ExampleModel> = this.application.get('ExampleModel');
    //
    // await model.create({
    //   _id: 'bf62b5a8-9687-4f62-acd0-398722a81d9c',
    //   number: 1000,
    //   name: 'example #1',
    //   enabled: true,
    // });
  }
}

export = ExampleFixture;
