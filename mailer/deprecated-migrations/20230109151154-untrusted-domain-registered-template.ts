import { updateTemplates } from './tools/update-template';

export async function up(db: any): Promise<void> {
  await updateTemplates(db, ['untrusted_domain_registered']);
}

export function down(): void {
  return null;
}
