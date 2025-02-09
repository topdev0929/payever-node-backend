import { emailTemplates, EmailTemplatesType } from '../fixtures/email-templates';

export async function up(db: any): Promise<void> {
  const templatesCodesToUpdate: string[] = [
    'admin_new_business_notice',
    'admin_registration_notice',
    'default_layout_logo_left',
  ];
  const templatesToUpdate: EmailTemplatesType[] = emailTemplates.filter(
    (item: EmailTemplatesType) => templatesCodesToUpdate.includes(item.template_name),
  );
  for (const template of templatesToUpdate) {
    await db._run('update', 'email_templates', {
      options: { upsert: true },
      query: { _id: template._id },
      update: template,
    });
  }
}

export function down(): void {
  return null;
}
