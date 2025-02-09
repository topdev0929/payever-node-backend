import { cloneDeepWith, template } from 'lodash';

export function resolveTemplatedObject<T, C extends object>(source: T, context: C): T {
  return cloneDeepWith(source, (value: any) => {
    if (typeof value !== 'string') {
      return;
    }

    return template(
      value,
      {
        escape: /{{{([^}]+)}}}/g,
        evaluate: null,
        interpolate: null,
      },
    )(context);
  });
}
