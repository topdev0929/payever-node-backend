/* eslint-disable */
import { Document, LeanDocument } from 'mongoose';
import { ExtractPropertyNamesOfType, PickOwnDocument } from './types';

// tslint:disable: jsdoc-format
/**
 * @example
 interface A extends Document {
     a?: boolean;
     b: string;
 }
 declare const a: Pick<A, OptionalPropertyOf<A>>;
 declare const b: Exclude<A, OptionalPropertyOf<A>>;
 declare const c: Pick<A, OptionalPropertyOf<A>> & Exclude<A, OptionalPropertyOf<A>>

 a.a;
 b.b;
 c.a;
 c.b;
 */
type OptionalPropertyOf<T> = Exclude<{
    [K in keyof T]: T extends Record<K, T[K]>
    ? never
    : K
}[keyof T], undefined>;
type SerializeBlackList = ((...args: any[]) => any) | Date;
export interface PopulationMap {
    [key: string]: PopulationMap;
}
type PopulatePropertyItem<T, P extends PopulationMap = null> = T extends object ? Populable<T, P> : never;
type PopulateProperty<T, P extends PopulationMap = null> = T extends any[] ? Array<PopulatePropertyItem<T[0], P>> : PopulatePropertyItem<T, P>;

type SerializePropertyItem<T, P extends PopulationMap = null> = T extends Document ? string : T extends SerializeBlackList ? T : T extends object ? Populable<T, P> : T;
type SerializeProperty<T, P extends PopulationMap = null> = T extends any[] ? Array<SerializePropertyItem<T[0], P>> : SerializePropertyItem<T, P>;

type PopulableInternal<T extends object, P extends PopulationMap = null> = {
    [K in Extract<keyof T, string>]: K extends keyof Document ? T[K] : K extends keyof P ? PopulateProperty<T[K], P[K]> : SerializeProperty<T[K], P[K]>;
};
type _Populable<T, P extends PopulationMap = null> =
    PopulableInternal<Omit<T, OptionalPropertyOf<T>>, P>
    &
    Partial<PopulableInternal<Pick<T, OptionalPropertyOf<T>>, P>>;

export type PopulationOption<T = any> = {
    path: PopulableKeys<T>;
    populate?: PopulationOption | PopulationOption[];
};

type PopulableKeys<T> = Extract<
    ExtractPropertyNamesOfType<PickOwnDocument<T>, Document>
    |
    ExtractPropertyNamesOfType<PickOwnDocument<T>, Document[]>
, string>;

type OverridedMethods = 'toObject' | 'toJSON';
// tslint:disable: jsdoc-format
/**
 * @description Converts `Document` to ref `string` in subtree of `interface EntityModel extends EntityInterface, mongoose.Document { ... }`. Used to push and fetch Documents in mongoose with correct typechecks
 * @example
 interface B extends Document {}
 interface A extends Document {
     a?: boolean;
     b: string;
     c: B;
     d: B[];
     e: {
         a: B;
         b: B[];
     };
     f: string;
     g: () => true;
 }

 declare const a: A;

 declare const z1: Populable<A>;
 z1.a;   //  boolean?
 z1.b;   //  string
 z1.c;   //  string
 z1.d;   //  string[]
 z1.e.a; //  string
 z1.e.b; //  string[]
 z1.f;   //  string
 z1.g;   //  function
 z1.updateOne;
 z1.populate;
 z1.depopulate;
 z1.execPopulate;

 declare const z2: Populable<A, {
     c: {};
     d: {};
     e: {
         a: {};
         b: {};
     };
     f: {};
     g: {};
 }>;
 z2.a;   //  boolean?
 z2.b;   //  string
 z2.c;   //  B
 z2.d;   //  B[]
 z2.e.a; //  B
 z2.e.b; //  B[]
 z2.f;   //  never - invalid population map
 z2.updateOne;
 z2.populate;
 z2.depopulate;
 z2.execPopulate;
 */
export type Populable<T, P extends PopulationMap = null> =
    _Populable<Omit<T, OverridedMethods>, P> &
    {
        toObject(): LeanDocument<Populable<T, P>>;
        toJSON(): LeanDocument<Populable<T, P>>;
    }
;
