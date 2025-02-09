import { updateTemplates } from './tools/update-template';

export async function up(db: any): Promise<void> {
  await updateTemplates(db, ['pos_santander_de.customer.signing_link']);
}

export function down(): void {
  return null;
}
