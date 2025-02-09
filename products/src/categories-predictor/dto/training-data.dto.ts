import { IsDefined } from 'class-validator';

export class TrainingDataDto {
  @IsDefined()
  public input: any;
  @IsDefined()
  public output: any;
}
