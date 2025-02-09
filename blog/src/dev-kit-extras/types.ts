import { Document } from 'mongoose';

export type PickOwnDocument<T> = Omit<T, keyof Document>;

/**
 * @reference https://github.com/tildeio/ts-std/issues/3
 */
export type ExtractPropertyNamesOfType<T, S> = {
    [K in keyof T]: T[K] extends S ? K : never;
}[keyof T];

