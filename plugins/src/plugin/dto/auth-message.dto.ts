import { IsNotEmpty, IsString } from 'class-validator';
import { BusinessMessageDto } from './';

export class AuthMessageDto {
    @IsNotEmpty()
    @IsString()
    public id: string;

    public business: BusinessMessageDto;
}
