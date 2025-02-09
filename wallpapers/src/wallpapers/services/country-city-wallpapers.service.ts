import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CountryCityWallpapersModel } from '../models';
import { CountryCityWallpapersSchemaName } from '../schemas';
import { CreateCountryCityWallpapersDto } from '../dto';

@Injectable()
export class CountryCityWallpapersService {
  constructor(
    @InjectModel(CountryCityWallpapersSchemaName) private readonly dataModel: Model<CountryCityWallpapersModel>,
  ) { }

  public async create(dto: CreateCountryCityWallpapersDto): Promise<CountryCityWallpapersModel> {
    return this.dataModel.create(dto as CountryCityWallpapersModel);
  }

  public async isWallpaperExists(query: { city: string; country: string }): Promise<boolean> {
    const entity: CountryCityWallpapersModel = await this.dataModel.findOne(query).exec();
    
    return !!entity && !!entity.fullPath;
  }

  public async getCityWallpaper(city: string): Promise<CountryCityWallpapersModel> {
    return this.dataModel.findOne({ city });
  }
}
