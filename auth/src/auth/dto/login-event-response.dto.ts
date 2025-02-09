import { TokensResultModel } from '@pe/nest-kit';

export class LoginEventResponseDto extends TokensResultModel {
  public isSecurityQuestionDefined?: boolean;
}
