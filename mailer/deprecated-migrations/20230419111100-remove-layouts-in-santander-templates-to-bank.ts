import { updateTemplates } from './tools/update-template';

export async function up(db: any): Promise<void> {
  await updateTemplates(db, [
    'santander_payment_cancel',
    'santander_contract_files_uploaded',
    'santander_payment_refund',
    'santander_dk_contract_files_uploaded',
    'santander_norway_contract_files_uploaded',
    'santander_dk_payment_sent',
    'santander_se_payment_sent',
    'santander_se_payment_cancel',
    'santander_dk_payment_cancel',
    'santander_dk_payment_refund',
    'santander_se_additional_info_added',
    'santander_nl.payment_action.refund',
    'santander_at.payment_action.refund',
    'santander_at.payment_action.cancel',
    'santander_at.payment_action.shipping_goods',
    'pos_santander_de.payment_action.refund',
    'santander_fi.payment_action.refund_santander',
  ]);
}

export function down(): void {
  return null;
}
