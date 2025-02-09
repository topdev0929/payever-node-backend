import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { UserRegistrationOriginInterface } from '../../interfaces';

export class UserRegistrationOriginDto implements UserRegistrationOriginInterface {
    @IsString()
    @IsNotEmpty()
    public account: string;

    @IsString()
    @IsNotEmpty()
    public url: string;

    @IsString()
    @IsOptional()
    public source?: string;
}
