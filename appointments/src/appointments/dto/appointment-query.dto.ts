import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { BaseQueryDto } from '../../common/dtos/base-query.dto';


export class AppointmentQueryDto extends BaseQueryDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString({ each: true })
    public businessIds?: string[];
}
