export function createStubService<T extends object>() {
  return new Proxy<T>({} as any, {
    getOwnPropertyDescriptor: () => ({
      configurable: true,
      value() {},
    }),
  });
}
