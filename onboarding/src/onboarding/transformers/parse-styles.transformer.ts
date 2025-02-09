import { v4 as uuid } from 'uuid';

import { CheckoutSettingsPayloadInterface } from '../interfaces/outgoing';

export function parseStylesTransformer(value: string): CheckoutSettingsPayloadInterface['styles'] {
  const escaped: string = value.replace(/#/gi, '%23');
  const parsed: URL = new URL(`styles://checkout/?${escaped}`);

  const styles: CheckoutSettingsPayloadInterface['styles'] = {
    _id: uuid(),
    active: true,
  };
  for (const [styleKey, styleVal] of parsed.searchParams) {
    if (!styleVal) {
      continue;
    }
    styles[styleKey] = styleVal;
  }

  return styles;
}
