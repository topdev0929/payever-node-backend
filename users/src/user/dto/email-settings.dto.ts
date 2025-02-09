/* eslint max-classes-per-file: 0 */
import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    IsNumber,
    IsBoolean,
    IsNotEmpty,
    IsOptional,
    ValidateNested,
} from 'class-validator';
import {
    Type,
} from 'class-transformer';

import { EmailSettingsInterface } from '../interfaces';

class OutgoingServerSettingsDto {
    @ApiProperty()
    @IsString()
    public host: string;

    @ApiProperty()
    @IsNumber()
    public port: number;

    @ApiProperty()
    @IsString()
    public username: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    public password: string;

    @ApiProperty()
    @IsBoolean()
    public secure: boolean;
}

export class EmailSettingsDto implements Omit<EmailSettingsInterface, 'business'> {
    @ApiProperty()
    @IsString()
    public description: string;

    @ApiProperty()
    @ValidateNested()
    @IsNotEmpty()
    @Type(() => OutgoingServerSettingsDto)
    public outgoingServerSettings: OutgoingServerSettingsDto;
}

