import { Module } from '@nestjs/common';
import { ChannelSetsResolver } from './channel-sets.resolver';

@Module({ providers: [ChannelSetsResolver] })
export class ChannelSetsModule { }
