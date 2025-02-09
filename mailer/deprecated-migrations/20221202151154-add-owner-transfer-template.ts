import { updateTemplates } from './tools/update-template';

export async function up(db: any): Promise<void> {
  await updateTemplates(db, ['owner_transfer']);
}

export function down(): void {
  return null;
}
