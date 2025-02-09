import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';

import { PagingDto } from './paging.dto';
import { SortingDto } from './sorting.dto';

export class ListQueryDto {
    @ApiProperty()
    @IsOptional()
    @IsString()
    public orderBy: string = 'createdAt';

    @ApiProperty()
    @IsOptional()
    @IsString()
    @IsIn(['asc', 'desc'])
    public direction: string = 'asc';

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    @Min(1)
    public page: number = 1;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    @Max(100)
    public limit: number = 10;

    @ApiProperty()
    @IsOptional()
    @IsString()
    public query: string;

    @ApiProperty()
    @IsNotEmpty()
    @Transform((stringified: string) => JSON.parse(stringified))
    public filters: any = { };

    public get sorting(): { [key: string]: string } {
        const sorting: SortingDto = new SortingDto(this.orderBy, this.direction);

        return { [sorting.field]: sorting.direction };
    }

    public get paging(): PagingDto {
        return new PagingDto(this.page, this.limit);
    }

    public get search(): string {
        return this.query;
    }

    public set search(search: string) {
        this.query = search;
    }
}
