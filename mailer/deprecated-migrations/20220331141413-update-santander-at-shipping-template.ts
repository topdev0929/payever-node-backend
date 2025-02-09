import { updateTemplates } from './tools/update-template';

export async function up(db: any): Promise<void> {
  await updateTemplates(db, ['santander_at.payment_action.shipping_goods']);
}

export function down(): void {
  return null;
}
