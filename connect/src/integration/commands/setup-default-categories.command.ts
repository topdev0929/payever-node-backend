import { Injectable, Logger } from '@nestjs/common';
import { Command } from '@pe/nest-kit';
import { CategoryService } from '../services';

@Injectable()
export class SetupDefaultCategoriesCommand {
  constructor(
    private readonly logger: Logger,
    private readonly categoryService: CategoryService,
  ) { }

  @Command({
    command: 'setup:default-categories',
    describe: 'Setup Default Categories',
  })
  public async export(): Promise<void> {
    this.logger.log('Setup Default Categories started');
    await this.categoryService
      .setupDefaultCategories();

    this.logger.log('Setup Default Categories finished');
  }
}
