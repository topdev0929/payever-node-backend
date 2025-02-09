export async function up(db: any): Promise<void> {
  await db._run('remove', 'email_templates', {
    _id: '39662d65-61c0-4401-a81f-18178ce5f51d',
  });

  await db._run('remove', 'email_templates', {
    _id: 'e5285c8e-5abd-4e31-8a48-36aaf872b547',
  });

  return null;
}

export function down(): void {
  return null;
}
