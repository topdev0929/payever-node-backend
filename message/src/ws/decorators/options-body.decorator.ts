import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const OptionsBody: (...dataOrPipes: any[]) => ParameterDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const args: any[] = ctx.getArgs() ? ctx.getArgs() : [];
    if (args.length >= 2 && args[1].reqId) {

      return ctx.getArgs()[1].reqId;
    }

    return null;
  },
);
