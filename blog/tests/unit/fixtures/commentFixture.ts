import { CreateCommentDto, CommentModel } from '../../../src/comment';

export class commentFixture {
  public static getCreateDTO(): CreateCommentDto {
    return {
      content: 'This is blog content.',
      author: 'user1',
    } as CreateCommentDto;
  }
  public static getModel(id: string, blogId: string): CommentModel {
    const model: CommentModel = {
      _id: id,
      id: id,
      save: (): void => { },
      toObject: (): void => { },
    } as CommentModel;
    return model;
  }
}
