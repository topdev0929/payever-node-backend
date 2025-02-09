import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { OptionsService } from '../../services/options.service';
import { OptionDocument } from '../../models/option.document';
import { NotFoundException } from '@nestjs/common';

@Resolver('Option')
export class OptionResolver {
  constructor(private readonly optionsService: OptionsService) { }

  @Mutation()
  public async createOption(
    @Args('data')
    data: Partial<OptionDocument>,
  ): Promise<OptionDocument> {
    return this.optionsService.createOption(data);
  }

  @Mutation()
  public async updateOption(
    @Args('id') id: string,
    @Args('data') data: Partial<OptionDocument>,
  ): Promise<OptionDocument> {
    const option: OptionDocument = await this.optionsService.updateOption(id, data);
    if (!option) {
      throw new NotFoundException(`Option "${id}" is not found.`);
    }

    return option;
  }

  @Mutation()
  public async deleteOption(@Args('id') id: string): Promise<OptionDocument> {
    const option: OptionDocument = await this.optionsService.deleteOption(id);
    if (!option) {
      throw new NotFoundException(`Option "${id}" is not found.`);
    }

    return option;
  }

  @Query()
  public async getOptions(): Promise<OptionDocument[]> {
    return this.optionsService.getOptions();
  }

  @Query()
  public async getOption(@Args('id') id: string): Promise<OptionDocument> {
    const option: OptionDocument = await this.optionsService.getOption(id);
    if (!option) {
      throw new NotFoundException(`Option "${id}" is not found.`);
    }

    return option;
  }
}
