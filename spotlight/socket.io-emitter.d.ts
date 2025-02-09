declare class Emitter<T> {
  to(room: string): Emitter<T>;
  of(namespace: string): Emitter<T>;
  emit(event: string, ...args: any[]): Emitter<T>;
  redis: T;
}

declare const m: {
  <T>(redisClient: T): Emitter<T>,
}

export = m;
