import { updateTemplates } from './tools/update-template';

export async function up(db: any): Promise<void> {
  await updateTemplates(db, ['santander_dk_payment_send_signing_link', 'default_layout_da']);
}

export function down(): void {
  return null;
}
