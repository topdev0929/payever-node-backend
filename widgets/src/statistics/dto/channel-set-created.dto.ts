import { IsNotEmpty, IsString } from 'class-validator';
import { BusinessDto } from './business.dto';
import { ChannelDto } from './channel.dto';

export class ChannelSetCreatedDto {
    @IsNotEmpty()
    @IsString()
    public id: string;
    public business: BusinessDto;
    public channel: ChannelDto;
}
