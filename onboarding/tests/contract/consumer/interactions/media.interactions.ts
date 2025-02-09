import { readFileSync } from 'fs';
import { join } from 'path';

import { InteractionObject, Matchers } from '@pact-foundation/pact';

import { BUSINESS_ID, UUID_REGEXP } from '../const';

const imageBlobBase64: string = readFileSync(
  join(__dirname, '..', 'static', 'small.jpg'),
).toString('base64');

const boundary: string = 'nVenJ7H4puv';

export class MediaInteractions {
  public static UploadMediaFile(): InteractionObject {
    return {
      state: undefined,
      uponReceiving: 'a request to pre-upload media files before other steps',
      willRespondWith: {
        body: {
          blobName: Matchers.term({
            generate: 'e524f311-0bd2-4b19-b2db-96396870f763-small.jpg',
            matcher: `${UUID_REGEXP}-small.jpg`,
          }),
        },
        status: 200,
      },
      withRequest: {
        'body': Matchers.term({
          generate: [
            `--${boundary}`,
            'Content-Disposition: form-data; name="file"; filename="small.jpg"',
            'Content-Transfer-Encoding: base64',
            'Content-Type: "image/jpeg"',
            '',
            imageBlobBase64,
            `--${boundary}--`,
          ].join('\r\n'),
          matcher: '',
        }),
        headers: {
          'Content-Type': Matchers.term({
            generate: `multipart/form-data; boundary=${boundary}`,
            matcher: 'multipart/form-data',
          }),
        },
        method: 'POST',
        path: Matchers.term({
          generate: `/api/image/business/${BUSINESS_ID}/wallpapers`,
          matcher: `/api/image/business/${UUID_REGEXP}/[wallpapers|images]`,
        }),
      },
    };
  }
}
