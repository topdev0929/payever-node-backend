import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationDto } from '../../common/dto';
import { AncestorHelper, PaginationHelper } from '../../common/helpers';
import { PaginationInterface } from '../../common/interfaces';
import { AlbumDto } from '../dto';
import { AlbumInterface, ResultInterface } from '../interfaces';
import { AlbumModel } from '../models';
import { AlbumSchemaName } from '../schemas';

@Injectable()
export class AlbumService {
  constructor(
    @InjectModel(AlbumSchemaName) private readonly albumModel: Model<AlbumModel>,
  ) { }

  public async create(
    businessId: string,
    dto: AlbumDto,
  ): Promise<AlbumModel> {
    const parentModel: AlbumModel = await this.albumModel.findOne(
      {
        _id: dto.parent,
      },
    );

    const set: AlbumInterface = {
      ancestors: AncestorHelper.buildAncestors(parentModel),
      businessId: businessId,
      ...dto,
    };

    return this.albumModel.findOneAndUpdate(
      {
        businessId: set.businessId,
        name: set.name,
      },
      {
        $set: set,
      },
      {
        new: true,
        setDefaultsOnInsert: true,
        upsert: true,
      },
    );
  }

  public async update(
    AlbumId: string,
    businessId: string,
    dto: AlbumDto,
  ): Promise<AlbumModel> {
    const set: AlbumInterface = {
      businessId: businessId,
      ...dto,
    };

    if (dto.parent || dto.parent === '') {
      const parentModel: AlbumModel = await this.albumModel.findOne(
        {
          _id: dto.parent,
        },
      );
      set.ancestors = AncestorHelper.buildAncestors(parentModel);
    }

    const album: AlbumModel = await this.albumModel.findOneAndUpdate(
      {
        _id: AlbumId,
      },
      {
        $set: set,
      },
      {
        new: true,
        setDefaultsOnInsert: true,
        upsert: false,
      },
    );

    if (dto.parent || dto.parent === '') {
      await this.updateChildrenAncestors(album);
    }

    return album;
  }

  public async remove(
    albumId: string,
    businessId: string,
  ): Promise<boolean> {
    const albumModel: AlbumModel = await this.albumModel.findOne(
      {
        _id: albumId,
        businessId: businessId,
      },
    );
    if (!albumModel) {
      return false;
    }
    await this.albumModel.deleteOne({ ancestors: albumModel.id });
    await albumModel.deleteOne();

    return true;
  }

  public async findById(
    albumId: string,
    businessId: string,
  ): Promise<AlbumModel> {
    return this.albumModel.findOne(
      {
        _id: albumId,
        businessId: businessId,
      },
    );
  }

  public async findByBusinessId(
    pagination: PaginationDto,
    businessId: string,
    parent?: string,
  ): Promise<ResultInterface> {
    const page: PaginationInterface = PaginationHelper.getPagination(pagination);
    const sort: any = PaginationHelper.getSortQuery(pagination);

    const query: any = {
      businessId: businessId,
    };

    if (parent) {
      query.parent = parent;
    } else {
      query.parent = null;
    }

    return {
      result: await this.albumModel.find(query).sort(sort).skip(page.skip).limit(page.limit),
      totalCount: await this.albumModel.count(query),
    };
  }

  public async findByBusinessIdAndAncestor(
    pagination: PaginationDto,
    businessId: string,
    ancestor: string,
  ): Promise<ResultInterface> {
    const page: PaginationInterface = PaginationHelper.getPagination(pagination);
    const sort: any = PaginationHelper.getSortQuery(pagination);

    return {
      result: await this.albumModel.find(
        {
          ancestors: ancestor,
          businessId: businessId,
        },
      ).sort(sort).skip(page.skip).limit(page.limit),
      totalCount: await this.albumModel.count(
        {
          ancestors: ancestor,
          businessId: businessId,
        },
      ),
    };
  }

  public async getAlbumForBuilder(
    businessId: string,
    filter: string,
    order: string = '',
    offset: number = 0,
    limit: number = 10,
  ): Promise<any> {
    const filterData: any = filter !== '' ? JSON.parse(filter) : null;

    let orderData: any = { };
    if (order && order !== '') {
      orderData = JSON.parse(order);
    }

    const asc: string[] = [];
    const desc: string[] = [];
    for (const data of orderData) {
      switch (true) {
        case data.direction === 'asc':
          asc.push(data.field);
          break;
        case data.direction === 'desc':
          desc.push(data.field);
          break;
      }
    }

    const pagination: PaginationDto = {
      asc: asc,
      desc: desc,
      limit: limit.toString(),
      offset: offset.toString(),
      page: null,
    };

    let result: ResultInterface = {
      result: [],
      totalCount: 0,
    };

    switch (true) {
      case (filterData.album !== undefined):
        const album: AlbumModel = await this.findById(filterData.album, businessId);
        result.result = [album];
        result.totalCount = 1;
        break;
      case (filterData.parent !== undefined):
        result = await this.findByBusinessId(pagination, businessId, filterData.parent);
        break;
      case (filterData.ancestor !== undefined):
        result = await this.findByBusinessIdAndAncestor(pagination, businessId, filterData.ancestor);
        break;
      default:
        result = await this.findByBusinessId(pagination, businessId);
        break;
    }

    return result;
  }

  public async createAlbumForBuilder(
    businessId: string,
    filter: string,
  ): Promise<any> {
    if (!filter || filter === '') {
      return ;
    }
    const filterData: AlbumDto = JSON.parse(filter);

    return this.create(businessId, filterData);
  }

  public async updateAlbumForBuilder(
    businessId: string,
    filter: string,
  ): Promise<any> {
    if (!filter || filter === '') {
      return ;
    }
    const filterData: any = JSON.parse(filter);
    const albumId: string = filterData.albumId;

    if (!albumId) {
      return ;
    }

    return this.update(albumId, businessId, filterData);
  }

  public async deleteAlbumForBuilder(
    businessId: string,
    filter: string,
  ): Promise<boolean> {
    if (!filter || filter === '') {
      return false;
    }
    const filterData: any = JSON.parse(filter);
    if (!filterData.albumId) {
      return false;
    }

    return this.remove(filterData.albumId, businessId);
  }

  private async updateChildrenAncestors(parent: AlbumModel): Promise<void> {
    const children: AlbumModel[] = await this.albumModel.find(
      {
        parent: parent.id,
      },
    );

    for (const child of children) {
      const ancestor: string[] = AncestorHelper.buildAncestors(parent);

      await this.albumModel.updateOne(
        {
          _id: child.id,
        },
        {
          $set: {
            ancestors: ancestor,
          },
        },
      );
      await this.updateChildrenAncestors(child);
    }
  }
}
