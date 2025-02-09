import { updateTemplates } from './tools/update-template';

export async function up(db: any): Promise<void> {
  await updateTemplates(db, ['second-factor']);
}

export function down(): void {
  return null;
}
