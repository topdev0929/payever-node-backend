import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsEnum, ValidateNested, IsOptional, IsBoolean } from 'class-validator';
import { RuleRangeDto } from './rule-range.dto';
import { CommissionTypesEnum } from '../../enums';
import { IntegrationRuleInterface } from '../../interfaces/rules';

export class UpdateIntegrationRuleDto implements IntegrationRuleInterface {
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
    @ValidateNested({ each: true })
    public readonly weightRanges: RuleRangeDto[];

    @ApiPropertyOptional()
    @IsOptional()
    @ValidateNested({ each: true })
    public readonly rateRanges: RuleRangeDto[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsEnum(CommissionTypesEnum)
    public readonly commissionType: CommissionTypesEnum;
}
