import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { IntegrationRuleInterface } from '../../interfaces';
import { CommissionTypesEnum } from '../../enums';
import { RuleRangeDto } from './rule-range.dto';

export class CreateIntegrationRuleDto implements IntegrationRuleInterface {
    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    public isActive: boolean;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    public readonly freeOver: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    public readonly flatRate: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    public readonly commission: number;

    @ApiPropertyOptional()
    @IsOptional()
    public readonly weightRanges: RuleRangeDto[];

    @ApiPropertyOptional()
    @IsOptional()
    public readonly rateRanges: RuleRangeDto[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsEnum(CommissionTypesEnum)
    public readonly commissionType: CommissionTypesEnum;
}
