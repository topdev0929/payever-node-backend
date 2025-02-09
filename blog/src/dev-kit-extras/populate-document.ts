import { Document } from 'mongoose';

import { Populable, PopulationMap, PopulationOption } from './population';

export async function populateDocument<P extends PopulationMap, T extends Document>(
  doc: Populable<T> | Array<Populable<T>>,
  opts: Array<PopulationOption<T>>,
  fn: (...populatedDocs: Array<Populable<T, P>>) => Promise<any>,
): Promise<any> {
  const docs: Array<Populable<T>> = Array.isArray(doc) ? doc : [doc];
  const populatedDocs: Array<Populable<T, P>> = await Promise.all(docs.map((document: Populable<T>) => {
    return (document as T).populate(opts).execPopulate() as any as Populable<T, P>;
  }));

  const result: any = await fn(...populatedDocs as any as Array<Populable<T, P>>);
  for (const populatedDoc of populatedDocs) {
    for (const opt of opts) {
      (populatedDoc as any as T).depopulate(opt.path);
    }
  }

  return result;
}
