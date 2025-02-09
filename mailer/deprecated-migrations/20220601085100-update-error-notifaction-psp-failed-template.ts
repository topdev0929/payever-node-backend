import { updateTemplates } from './tools/update-template';

export async function up(db: any): Promise<void> {
  await updateTemplates(db, ['error_notifications.psp-api.failed']);
}

export function down(): void {
  return null;
}
