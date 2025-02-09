import { ApiProperty } from '@nestjs/swagger';

import {
  IsBoolean,
  IsOptional,
} from 'class-validator';

import { CommonChannel } from '../../../message/submodules/messaging/common-channels';

type optionalProps = 'usedInWidget';

export class IntegrationChannelUpdateDto implements
  Partial<Pick<CommonChannel, optionalProps>> {
    @ApiProperty({ required: true })
    @IsBoolean()
    @IsOptional()
    public usedInWidget?: boolean;
}
