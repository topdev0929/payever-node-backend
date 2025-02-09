import * as crypto from 'crypto';

export const generate: () => string = (): string => [...crypto.randomBytes(12)]
    .map((byte: number) => (byte % 36).toString(36)).join('').toUpperCase();
export const generatedRegExp: RegExp = /[A-Z0-9]{12}/;
export const manualRegExp: RegExp = /[A-Z0-9_-]{1,32}/;
