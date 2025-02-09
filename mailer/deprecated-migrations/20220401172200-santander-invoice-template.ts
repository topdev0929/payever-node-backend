import { updateTemplates } from './tools/update-template';

export async function up(db: any): Promise<void> {
  await updateTemplates(db, ['santander_invoice_downpayment_customer']);
}

export function down(): void {
  return null;
}
