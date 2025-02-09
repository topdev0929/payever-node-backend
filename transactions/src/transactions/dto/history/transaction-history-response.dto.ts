import { ApiProperty } from '@nestjs/swagger';

export class TransactionHistoryResponseDto{
  @ApiProperty()
  public id: string;

  @ApiProperty()
  public action: string;

  @ApiProperty()
  public amount: number;

  @ApiProperty()
  public currency?: string;

  @ApiProperty()
  public reason?: string;

  @ApiProperty()
  public items?: any[];

  @ApiProperty()
  public user?: any;

  @ApiProperty()
  public status?: string;

  @ApiProperty()
  public createdAt: Date;

  @ApiProperty()
  public transactionId?: string;
}
