export async function up(db: any): Promise<void> {
  await db.removeIndex('email_templates', 'template_name_1');

  return null;
}

export function down(): void {
  return null;
}
