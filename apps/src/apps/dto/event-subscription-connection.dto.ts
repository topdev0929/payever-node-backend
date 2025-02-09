import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, ValidateIf } from 'class-validator';

import { EventSubscriptionConnectionTypeEnum } from '../enums';

export class EventSubscriptionConnectionDto {
  @ApiProperty({ enum: Object.values(EventSubscriptionConnectionTypeEnum) })
  @IsNotEmpty()
  @IsEnum(EventSubscriptionConnectionTypeEnum)
  public type: EventSubscriptionConnectionTypeEnum;

  // SQS

  @ApiProperty({ required: false })
  @ValidateIf((o: EventSubscriptionConnectionDto) => o.type === EventSubscriptionConnectionTypeEnum.AWSSQS)
  @IsString()
  public queueUrl: string;

  @ApiProperty({ required: false })
  @ValidateIf((o: EventSubscriptionConnectionDto) => o.type === EventSubscriptionConnectionTypeEnum.AWSSQS)
  @IsString()
  public region: string;

  // SNS

  @ApiProperty({ required: false })
  @ValidateIf((o: EventSubscriptionConnectionDto) => o.type === EventSubscriptionConnectionTypeEnum.AWSSNS)
  @IsString()
  public topicArn: string;

  // AzureServiceBus

  @ApiProperty({ required: false })
  @ValidateIf((o: EventSubscriptionConnectionDto) => o.type === EventSubscriptionConnectionTypeEnum.AzureServiceBus)
  @IsString()
  public connectionString: string;

  // AzureEventGrid

  @ApiProperty({ required: false })
  @ValidateIf((o: EventSubscriptionConnectionDto) => o.type === EventSubscriptionConnectionTypeEnum.AzureEventGrid)
  @IsString()
  public uri: string;

  // GoogleCloudPubSub

  @ApiProperty({ required: false })
  @ValidateIf((o: EventSubscriptionConnectionDto) => o.type === EventSubscriptionConnectionTypeEnum.GoogleCloudPubSub)
  @IsString()
  public projectId: string;

  @ApiProperty({ required: false })
  @ValidateIf((o: EventSubscriptionConnectionDto) => o.type === EventSubscriptionConnectionTypeEnum.GoogleCloudPubSub)
  @IsString()
  public topic: string;

  // RabbitMQ

  @ApiProperty({ required: false })
  @ValidateIf((o: EventSubscriptionConnectionDto) => o.type === EventSubscriptionConnectionTypeEnum.RabbitMQ)
  @IsString()
  public url: string;

  @ApiProperty({ required: false })
  @ValidateIf((o: EventSubscriptionConnectionDto) => o.type === EventSubscriptionConnectionTypeEnum.RabbitMQ)
  @IsString()
  public exchangeName: string; // the fallback exchange will be `${exchangeName}_fallback`

  // Webhook

  @ApiProperty({ required: false })
  @ValidateIf((o: EventSubscriptionConnectionDto) => o.type === EventSubscriptionConnectionTypeEnum.Webhook)
  @IsString()
  public webhook: string;

  // Common (SQS, SNS, EventGrid)

  @ApiProperty({ required: false })
  @ValidateIf(
    (o: EventSubscriptionConnectionDto) =>
      [
        EventSubscriptionConnectionTypeEnum.AWSSQS,
        EventSubscriptionConnectionTypeEnum.AWSSNS,
        EventSubscriptionConnectionTypeEnum.AzureEventGrid,
      ].includes(o.type),
  )
  @IsString()
  public accessKey: string;

  @ApiProperty({ required: false })
  @ValidateIf(
    (o: EventSubscriptionConnectionDto) =>
      [
        EventSubscriptionConnectionTypeEnum.AWSSQS,
        EventSubscriptionConnectionTypeEnum.AWSSNS,
      ].includes(o.type),
  )
  @IsString()
  public accessSecret: string;
}
