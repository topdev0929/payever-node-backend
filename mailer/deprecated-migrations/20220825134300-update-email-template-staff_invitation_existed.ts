import { updateTemplates } from './tools/update-template';

export async function up(db: any): Promise<void> {
  await updateTemplates(db, ['staff_invitation_new', 'passwordReset']);
}

export function down(): void {
  return null;
}
