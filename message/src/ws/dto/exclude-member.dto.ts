import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class ExcludeMemberDto {
  @IsNotEmpty()
  @ApiProperty({ required: true })
  public chatId: string;

  @IsOptional()
  @ApiProperty({ required: false })
  public userId: string;

  @IsOptional()
  @ApiProperty({ required: false })
  public contactId: string;
}
