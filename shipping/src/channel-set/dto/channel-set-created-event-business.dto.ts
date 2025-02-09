import { IsNotEmpty, IsString } from 'class-validator';
export class ChannelSetCreatedEventBusinessDto {
    @IsNotEmpty()
    @IsString()
    public readonly id: string;
}
