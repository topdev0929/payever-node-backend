import {
  defaultLayoutAutomatedEmailTemplates,
  notificationEmailTemplates,
  productAutomatedEmailTemplates,
  businessAutomatedEmailTemplates,
  shopAutomatedEmailTemplates,
  transactionAutomatedEmailTemplates,
  checkoutAutomatedEmailTemplates,
  shippingAutomatedEmailTemplates,
  connectAutomatedEmailTemplates,
  posAutomatedEmailTemplates,
  authAutomatedEmailTemplates,
} from '../fixtures/automated';

export async function up(db: any): Promise<any> {
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

  await db.addIndex('email_templates', null, ['template_name', 'locale'], true);

  return null;
}

export function down(): Promise<any> {
  return null;
}
