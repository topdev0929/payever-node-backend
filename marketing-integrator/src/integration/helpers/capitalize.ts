
export function capitalize(str: string): string {
  return typeof str === 'string' ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}
