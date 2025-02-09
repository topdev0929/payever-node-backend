import { IsString } from 'class-validator';

export class ProductChannelSetDto {
  @IsString()
  public id: string;

  constructor(id: string) {
    this.id = id;
  }
}
