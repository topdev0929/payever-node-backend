export type MsgpackDecodeResult = [string, PayloadWrapper<Payload>, any];
export type Payload = [string, unknown, unknown, unknown];
export interface PayloadWrapper<T> {
  type: number;
  data: T;
  nsp: string;
}
