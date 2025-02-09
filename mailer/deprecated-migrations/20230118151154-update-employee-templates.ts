import { updateTemplates } from './tools/update-template';

export async function up(db: any): Promise<void> {
  await updateTemplates(db, ['employee_access_approved', 'untrusted_domain_registered']);
}

export function down(): void {
  return null;
}
