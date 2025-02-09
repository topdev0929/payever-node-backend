import {
  authAutomatedEmailTemplates,
  businessAutomatedEmailTemplates, checkoutAutomatedEmailTemplates, connectAutomatedEmailTemplates,
  defaultLayoutAutomatedEmailTemplates,
  notificationEmailTemplates, posAutomatedEmailTemplates,
  productAutomatedEmailTemplates, shippingAutomatedEmailTemplates,
  shopAutomatedEmailTemplates,
  transactionAutomatedEmailTemplates,
} from '../fixtures/automated';

export async function up(db: any): Promise<void> {
  for (const automatedEmailTemplate of defaultLayoutAutomatedEmailTemplates) {
    await db._run('update', 'email_templates', {
      options: { upsert: true },
      query: { _id: automatedEmailTemplate._id },
      update: automatedEmailTemplate,
    });
  }

  for (const automatedEmailTemplate of notificationEmailTemplates) {
    await db._run('update', 'email_templates', {
      options: { upsert: true },
      query: { _id: automatedEmailTemplate._id },
      update: automatedEmailTemplate,
    });
  }

  for (const automatedEmailTemplate of productAutomatedEmailTemplates) {
    await db._run('update', 'email_templates', {
      options: { upsert: true },
      query: { _id: automatedEmailTemplate._id },
      update: automatedEmailTemplate,
    });
  }

  for (const automatedEmailTemplate of businessAutomatedEmailTemplates) {
    await db._run('update', 'email_templates', {
      options: { upsert: true },
      query: { _id: automatedEmailTemplate._id },
      update: automatedEmailTemplate,
    });
  }

  for (const automatedEmailTemplate of shopAutomatedEmailTemplates) {
    await db._run('update', 'email_templates', {
      options: { upsert: true },
      query: { _id: automatedEmailTemplate._id },
      update: automatedEmailTemplate,
    });
  }

  for (const automatedEmailTemplate of transactionAutomatedEmailTemplates) {
    await db._run('update', 'email_templates', {
      options: { upsert: true },
      query: { _id: automatedEmailTemplate._id },
      update: automatedEmailTemplate,
    });
  }

  for (const automatedEmailTemplate of checkoutAutomatedEmailTemplates) {
    await db._run('update', 'email_templates', {
      options: { upsert: true },
      query: { _id: automatedEmailTemplate._id },
      update: automatedEmailTemplate,
    });
  }

  for (const automatedEmailTemplate of shippingAutomatedEmailTemplates) {
    await db._run('update', 'email_templates', {
      options: { upsert: true },
      query: { _id: automatedEmailTemplate._id },
      update: automatedEmailTemplate,
    });
  }

  for (const automatedEmailTemplate of connectAutomatedEmailTemplates) {
    await db._run('update', 'email_templates', {
      options: { upsert: true },
      query: { _id: automatedEmailTemplate._id },
      update: automatedEmailTemplate,
    });
  }

  for (const automatedEmailTemplate of posAutomatedEmailTemplates) {
    await db._run('update', 'email_templates', {
      options: { upsert: true },
      query: { _id: automatedEmailTemplate._id },
      update: automatedEmailTemplate,
    });
  }

  for (const automatedEmailTemplate of authAutomatedEmailTemplates) {
    await db._run('update', 'email_templates', {
      options: { upsert: true },
      query: { _id: automatedEmailTemplate._id },
      update: automatedEmailTemplate,
    });
  }

  return null;
}

export function down(): void {
  return null;
}
