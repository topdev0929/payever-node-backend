import { Injectable } from '@nestjs/common';

import { Populable } from '../../dev-kit-extras/population';
import { BlogModel } from '../models';
import { DomainModel } from '../models/domain.model';
import { BlogAccessConfigModel } from '../models/blog-access-config.model';

@Injectable()
export class PopulatorService {
    public async populateBlog(blog: Populable<BlogModel>): Promise<Populable<BlogModel, {
        channelSet: { };
        business: { };
    }>> {
        await blog
            .populate('channelSet')
            .populate('business')
            .execPopulate();

        return blog as any;
    }

    public async populateAccessConfig(accessConfig: Populable<BlogAccessConfigModel>):
    Promise<Populable<BlogAccessConfigModel, {
        blog: { };
    }>> {
        await accessConfig
            .populate({
                path: 'blog',
            })
            .execPopulate();

        return accessConfig as any;
    }

    public async populateDomain(domain: Populable<DomainModel>): Promise<Populable<DomainModel, {
        blog: { };
    }>> {
        await domain
            .populate({
                path: 'blog',
            })
            .execPopulate();

        return domain as any;
    }
}
