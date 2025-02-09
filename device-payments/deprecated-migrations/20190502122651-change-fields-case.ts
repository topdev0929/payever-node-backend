export async function up(db: any): Promise<void> {
  await db._run('update', 'businesses', {
    query: {},
    update: {
      $rename: {business_id: 'businessId', default_terminal_id: 'defaultTerminalId'},
    },
    options: {upsert: false, multi: true},
  });

  try {
    await db.removeIndex('checkouts', 'phone_number_1_keyword_1');
  } catch (e) {}
  await db._run('update', 'checkouts', {
    query: {},
    update: {
      $rename: {phone_number: 'phoneNumber'},
    },
    options: {upsert: false, multi: true},
  });

  await db._run('update', 'paymentcodes', {
    query: {},
    update: {
      $rename: {
        business_id: 'businessId',
        terminal_id: 'terminalId',
        channel_set_id: 'channelSetId',
        checkout_id: 'checkoutId',
        created_at: 'createdAt',
        payment_flow_id: 'paymentFlowId',
        payment_id: 'paymentId',
        payment_method: 'paymentMethod',
      },
    },
    options: {upsert: false, multi: true},
  });

  try {
    await db.removeIndex('terminals', 'phone_number_1');
  } catch (e) {}
  try {
    await db.removeIndex('terminals', 'business_id_1');
  } catch (e) {}
  await db._run('update', 'terminals', {
    query: {},
    update: {
      $rename: {business_id: 'businessId', channel_set_id: 'channelSetId', terminal_id: 'terminalId'},
    },
    options: {upsert: false, multi: true},
  });
}

export async function down(): Promise<void> {}
