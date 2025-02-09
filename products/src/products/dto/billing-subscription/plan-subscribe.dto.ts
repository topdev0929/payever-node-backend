import { IsString, IsNotEmpty } from 'class-validator';

export class PlanSubscribeDto {
  @IsString()
  @IsNotEmpty()
  public businessId: string;
  @IsString()
  @IsNotEmpty()
  public productId: string;
}
