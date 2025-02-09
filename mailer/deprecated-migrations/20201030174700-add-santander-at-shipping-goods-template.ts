import { emailTemplates, EmailTemplatesType } from '../fixtures/email-templates';

export async function up(db: any): Promise<void> {
  const santanderATShippingGoodsTemplate: EmailTemplatesType =
    emailTemplates.find((template: EmailTemplatesType) => {
      return template.template_name === 'santander_at.payment_action.shipping_goods';
    });

  if (santanderATShippingGoodsTemplate) {
    await db._run('insert', 'email_templates', santanderATShippingGoodsTemplate);
  }

  return null;
}

export function down(): void {
  return null;
}
