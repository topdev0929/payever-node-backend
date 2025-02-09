import { Populable } from '../dev-kit-extras/population';
import { BlogAccessConfigModel } from '../blog/models';

export type WithAccessConfig<T> = T & {
  accessConfig: Populable<BlogAccessConfigModel>;
};
