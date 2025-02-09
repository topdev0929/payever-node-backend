import { emailTemplates, EmailTemplatesType } from '../fixtures/email-templates';

export async function up(db: any): Promise<void> {
  const stripeCustomerTemplate: EmailTemplatesType =
    emailTemplates.find((template: EmailTemplatesType) => {
      return template.template_name === 'stripe.credit_card.payment_success.customer';
    });

  if (stripeCustomerTemplate) {
    await db._run('update', 'email_templates', {
      query: { _id: stripeCustomerTemplate._id },
      update: { $set: stripeCustomerTemplate },
    });
  }

  return null;
}

export function down(): void {
  return null;
}
