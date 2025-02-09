export class mongooseModelFixture {
  public static getModelMock(): any {
    return {
      create: (): any => { },
      deleteMany: (): any => { },
      deleteOne: (): any => { },
      find: (): any => { },
      findById: (): any => { },
      findByIdAndRemove: (): any => { },
      findByIdAndUpdate: (): any => { },
      findOne: (): any => { },
      findOneAndUpdate: (): any => { },
      remove: (): any => { },
      update: (): any => { },
    };
  }
}
