import { updateTemplates } from './tools/update-template';

export async function up(db: any): Promise<void> {
  await updateTemplates(db, ['payment.verify.pin']);
}

export function down(): void {
  return null;
}
