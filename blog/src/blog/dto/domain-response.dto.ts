import { LeanDocument } from 'mongoose';
import { Populable } from '../../dev-kit-extras/population';
import { BlogAccessConfigModel, BlogModel, DomainModel } from '../models';
import { WithAccessConfig } from '../../compatibility/types';

export type BlogWithAccessConfigResponseDto = LeanDocument<WithAccessConfig<BlogAccessConfigResponseDto>>;
export type BlogAccessConfigResponseDto = LeanDocument<Populable<BlogModel, {
  channelSet: { };
  business: { };
}>>;

export type DomainResponseDto = LeanDocument<Omit<Populable<DomainModel>, 'blog'> & {
  blog: BlogWithAccessConfigResponseDto;
}>;

export type BlogCreatedResponseDto = LeanDocument<Populable<BlogModel, {
  channelSet: {
    channel: { };
    business: { };
  };
  business: { };
}> & {
  accessConfig: Populable<BlogAccessConfigModel, {
    blog: {
      channelSet: {
        channel: { };
      };
      business: { };
    };
  }>;
}>;
