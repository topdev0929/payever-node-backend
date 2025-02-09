import { updateTemplates } from './tools/update-template';

export async function up(db: any): Promise<void> {
  await updateTemplates(db, ['checkout.finalize_payment']);
}

export function down(): void {
  return null;
}
