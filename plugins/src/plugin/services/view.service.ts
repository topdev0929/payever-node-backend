import { Injectable } from '@nestjs/common';
import { PluginModel } from '../models';
import { PluginForm } from '../views';
import { FormResponseInterface } from '@pe/third-party-forms-sdk';

@Injectable()
export class ViewService {
  public constructor() { }

  public async getForm(
    plugin: PluginModel,
    channel: string,
  ): Promise<FormResponseInterface> {
    return {
      form: PluginForm.render(plugin, channel),
    };
  }
}
