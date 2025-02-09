import { updateTemplates } from './tools/update-template';

export async function up(db: any): Promise<void> {
  await updateTemplates(db, [
    'santander_be.payment_action.shipping_goods',
    'santander_be.payment_action.refund',
  ]);
}

export function down(): void {
  return null;
}
