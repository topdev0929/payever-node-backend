import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as dns from 'dns';
import { v4 as uuid4 } from 'uuid';
import { EventDispatcher } from '@pe/nest-kit';

import { DomainCheckInterface } from '../interfaces';
import { BlogAccessConfigSchemaName, DomainSchemaName } from '../../mongoose-schema/mongoose-schema.names';
import { BlogAccessConfigModel, BlogModel, DomainModel } from '../models';
import { Populable } from '../../dev-kit-extras/population';
import { DomainResponseDto } from '../dto/domain-response.dto';
import { dispatchWrapperFactory } from '../producers';
import { CreateDomainDto, UpdateDomainDto } from '../dto';
import { KubernetesEventEnum } from '@pe/kubernetes-kit/module/kubernetes/enums';
import { environment } from '../../environments';

const PAYEVER_IP: string = '52.136.251.236';
const PAYEVER_CNAME: string = 'shops.payever.shop';
const HOUR_IN_MS: number = 60000; // 60 * 1000

@Injectable()
export class DomainService {
  private readonly dispatch: ReturnType<typeof dispatchWrapperFactory>;
  constructor(
    @InjectModel(DomainSchemaName) private readonly domainModel: Model<Populable<DomainModel>>,
    @InjectModel(BlogAccessConfigSchemaName)
    private readonly blogAccessConfigModel: Model<Populable<BlogAccessConfigModel>>,
    dispatcher: EventDispatcher,
  ) {
    this.dispatch = dispatchWrapperFactory(dispatcher);
  }

  public async findByBlog(blog: Populable<BlogModel>): Promise<Array<Populable<DomainModel>>> {
    return this.domainModel.find({
      blog: blog._id,
    });
  }

  public async deleteByBlog(blog: BlogModel): Promise<any> {
    const domains: Array<Populable<DomainModel>> = await this.domainModel.find({
      blog: blog._id,
    });

    for (const domain of domains) {
      await this.domainModel.deleteOne({ _id: domain._id });

      await this.dispatch(
        KubernetesEventEnum.DomainRemoved,
        domain.toObject(),
      );
    }
  }

  public async domainToDomainResponseDto(domain: Populable<DomainModel>): Promise<DomainResponseDto> {
    const accessConfig: Populable<BlogAccessConfigModel> = await this.blogAccessConfigModel.findOne({
      blog: domain.blog,
    });

    const populatedDomain: Populable<DomainModel, {
      blog: {
        channelSet: { };
        business: { };
      };
    }> = (await domain
      .populate({
        path: 'blog',
        populate: [{
          path: 'channelSet',
        }, {
          path: 'business',
        }],
      })
      .execPopulate()) as any as Populable<DomainModel, {
        blog: {
          channelSet: { };
          business: { };
        };
      }>;

    const leanDocument: any = populatedDomain.toObject();
    const leanBlog: any = populatedDomain.blog.toObject();
    const leanAccessConfig: any = accessConfig.toObject();

    return {
      ...leanDocument,
      blog: {
        ...leanBlog,
        accessConfig: leanAccessConfig,
      },
    };
  }

  public async create(
    blog: Populable<BlogModel>,
    dto: CreateDomainDto,
  ): Promise<Populable<DomainModel>> {
    const domain: Populable<DomainModel> = await this.domainModel.create({
      _id: uuid4(),
      blog: blog._id,
      isConnected: false,
      name: dto.name,
    });

    await this.dispatch(
      KubernetesEventEnum.DomainCreated,
      domain.toObject(),
    );

    return domain;
  }


  public async delete(domain: Populable<DomainModel>): Promise<void> {
    await this.domainModel.findByIdAndDelete(domain._id);
    await this.dispatch(
      KubernetesEventEnum.DomainRemoved,
      domain.toObject(),
    );
  }

  public async update(
    current: Populable<DomainModel>,
    dto: UpdateDomainDto,
  ): Promise<Populable<DomainModel>> {
    const newDomain: any = await this.domainModel.findOneAndUpdate(
    {
      _id: current._id,
    },
    {
      $set: dto,
    },
    {
      new: true,
    },
    );

    await this.dispatch(
      KubernetesEventEnum.DomainUpdated,
      current.toObject(),
      newDomain.toObject(),
    );

    return newDomain;
  }

  public async checkStatus(
    domain: Pick<Populable<DomainModel>, 'name' | 'isConnected' | '_id'>,
  ): Promise<DomainCheckInterface> {
    let cnames: string[] = [];
    try {
      cnames = await dns.promises.resolveCname(domain.name);
    } catch (e) {
    }

    try {
      const lookupAddress: dns.LookupAddress = await dns.promises.lookup(domain.name);
      const status: boolean = lookupAddress.address === PAYEVER_IP;

      if (status !== domain.isConnected) {
        await this.domainModel.findByIdAndUpdate(domain._id, { isConnected: status });
      }

      return {
        cnames: cnames,
        currentCname: status ? PAYEVER_CNAME : '',
        currentIp: lookupAddress.address,
        isConnected: status,
        requiredCname: PAYEVER_CNAME,
        requiredIp: PAYEVER_IP,
      };
    } catch (e) {
      throw new HttpException('No DNS record found for this domain', 400);
    }
  }

  public async findByDomain(domain: string): Promise<Populable<DomainModel, {
    blog: { };
  }>> {
    const query: any = this.domainModel.findOne({
      name: domain,
    }).populate('blog');

    return (await query) as Populable<DomainModel, {
      blog: { };
    }>;
  }

  public async getDomain(blog: BlogModel): Promise<string> {
    const foundDomains: any[] = await this.domainModel.find({
      blog: blog._id,
    });
    if (foundDomains && foundDomains.length > 0) {
      const domain: DomainModel =
        foundDomains.find(async (dmn: DomainModel) => {
          return dmn.isConnected;
        });
      if (domain) {
        return domain.name;
      }
    }

    const siteAccessConfig: any =
      await this.blogAccessConfigModel.findOne(
        {
          blog: blog._id,
        },
      );

    if (!siteAccessConfig) {
      return;
    }

    return siteAccessConfig.ownDomain ? siteAccessConfig.ownDomain
      : `${siteAccessConfig.internalDomain}.${environment.blogsDomain}`;
  }
}
