import { updateTemplates } from './tools/update-template';

export async function up(db: any): Promise<void> {
  await updateTemplates(db, ['passwordSet']);
  await updateTemplates(db, ['passwordReset']);
}

export function down(): void {
  return null;
}
