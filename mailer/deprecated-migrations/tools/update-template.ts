import { emailTemplates, EmailTemplatesType } from '../../fixtures/email-templates';

export async function updateTemplates(db: any, templates: string[]): Promise<void> {
  const templatesToUpdate: EmailTemplatesType[] = emailTemplates.filter(
    (item: EmailTemplatesType) => templates.includes(item.template_name),
  );

  for (const template of templatesToUpdate) {
    await db._run('update', 'email_templates', {
      options: { upsert: true },
      query: { _id: template._id},
      update: {
        $set: template,
      },
    });
  }
}
