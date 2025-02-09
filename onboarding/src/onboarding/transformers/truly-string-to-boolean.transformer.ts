export function trulyStringToBoolean(value: string): boolean {
  return ['true', 'yes'].includes(value?.toLowerCase().trim());
}
