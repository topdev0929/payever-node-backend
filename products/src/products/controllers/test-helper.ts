import { IncomingMessageInterface } from '@pe/nest-kit';

function wrapDataInEvent<T>(data: T): IncomingMessageInterface<T> {
  return {
    channel: 'string',
    data: {
      createdAt: '2019-06-19T11:00:00.000Z',
      encryption: 'string',
      metadata: {
        locale: 'locale',
      },
      name: 'string',
      payload: data,
      uuid: 'string',
      version: 4,
    },
  };
}

export { wrapDataInEvent };
