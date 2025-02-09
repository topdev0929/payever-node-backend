import { 
  IsOptional, 
  IsString, 
} from 'class-validator';

export class IdDto{

  @IsOptional()
  @IsString()
  public id: string;
}
