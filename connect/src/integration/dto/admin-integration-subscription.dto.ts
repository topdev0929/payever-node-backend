import { IsArray, IsBoolean, IsOptional, IsNotEmpty, IsString, ValidateNested, IsUUID } from 'class-validator';

export class AdminIntegrationSubscriptionDto {

    @IsString()
    @IsNotEmpty()
    public businessId?: string;

    @IsString()
    @IsOptional()
    public integration?: any;

    @IsBoolean()
    @IsNotEmpty()
    public installed?: boolean;

    @IsOptional()
    public payload?: any;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    public scopes?: string[];
}
