import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import {
    BubbleInterface,
    ButtonInterface,
    CalculatorInterface,
    StorePosListInterface,
    TextLinkInterface,
} from '../interfaces';


export class CreateChannelSettingsDto {
    @ApiProperty({ required: false })
    @IsOptional()
    public bubble: BubbleInterface;

    @ApiProperty({ required: false })
    @IsOptional()
    public button: ButtonInterface;

    @ApiProperty({ required: false })
    @IsOptional()
    public calculator: CalculatorInterface;

    @ApiProperty({ required: false })
    @IsOptional()
    public activePosList: [StorePosListInterface];

    @ApiProperty({ required: false })
    @IsOptional()
    public activeStoreList: [StorePosListInterface];

    @ApiProperty({ required: false })
    @IsOptional()
    public textLink: TextLinkInterface;
}
