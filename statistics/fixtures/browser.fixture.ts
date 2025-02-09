import { BrowserEnum } from '../src/statistics';

export const browserFixture = [
  { title: 'Chrome', value: ['Chrome'] },
  { title: 'Safari', value: ['Safari'] },
  { title: 'Edge', value: ['Edge'] },
  { 
    title: 'Other', 
    value: Object.keys(BrowserEnum)
    .filter((i: string) => i !== 'Safari' && i !== 'Chrome' && i !== 'Edge'),
  },
];
