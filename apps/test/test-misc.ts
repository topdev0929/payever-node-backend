import { plainToClass } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';
import { validate } from 'class-validator';

export function createStubService<T extends object>(): any {
  return new Proxy<T>({ } as any, {
    getOwnPropertyDescriptor: () => ({
      configurable: true,
      value(): any { },
    }),
  });
}

export async function createDto<T extends object>(cls: ClassType<T>, plain: object): any {
  const dto: any = plainToClass<T, object>(cls, plain);
  const errors: any = await validate(dto);
  if (errors.length) {
    throw errors[0];
  }

  return dto;
}
