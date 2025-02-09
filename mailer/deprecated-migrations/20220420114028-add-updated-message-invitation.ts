import { updateTemplates } from './tools/update-template';

export async function up(db: any): Promise<void> {
  await updateTemplates(db, ['message_invitation']);
}

export function down(): void {
  return null;
}
