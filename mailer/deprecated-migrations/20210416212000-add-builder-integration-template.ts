import { builderIntegrationTemplates } from '../fixtures/builder-integration.templates';

export async function up(db: any): Promise<void> {
  for (const data of builderIntegrationTemplates) {
    await db._run('update', 'email_templates', {
      options: { upsert: true },
      query: { _id: data._id },
      update: data,
    });
  }

  return null;
}

export function down(): void {
  return null;
}
