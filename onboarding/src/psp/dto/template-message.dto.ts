import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class TemplateMessageDto {
  @IsNotEmpty()
  @IsString()
  public name: string;

  @IsNotEmpty()
  @IsDefined()
  public config: {
    [key: string]: {
      [key: string]: any;
    };
  };
}
