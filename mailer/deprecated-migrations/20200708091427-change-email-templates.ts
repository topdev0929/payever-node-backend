import { emailTemplates } from '../fixtures/email-templates';

export async function up(db: any): Promise<void> {
  for (const template of emailTemplates) {
    await db._run('update', 'email_templates', {
      options: { upsert: true },
      query: { _id: template._id },
      update: template,
    });
  }

  const idsToDelete: string[] = [
    'f4be87fe-43b2-4dc0-b522-47865052fdce',
    '53bf3cbe-0f21-48cb-bd11-85b9deed1453',
    '0fc2ead0-c6d5-46d4-82cc-8661b6152f04',
    'e6ad4a9e-4132-45f2-aff6-e42368299a9a',
    '121a7e42-5498-49d8-84e2-7d87457a5384',
    '448a3901-bfc1-4107-a0f0-b162d0646ee0',
  ];

  for (const _id of idsToDelete) {
    await db._run('remove', 'email_templates', { _id });
  }

  return null;
}

export function down(): void {
  return null;
}
