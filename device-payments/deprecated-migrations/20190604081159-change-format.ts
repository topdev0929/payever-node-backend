export async function up(db: any): Promise<void> {
  const paymentCodes = await db._run('find', 'paymentcodes', {flow: {$exists: false}});

  const addData = (update, code, fieldName, fieldValue) => {
    if (code[fieldValue] !== undefined) {
      update[fieldName] = code[fieldValue];
    }
  };

  for (const paymentCode of paymentCodes) {
    const update = {};

    const paymentCodeFields = {
      'flow.id': 'paymentFlowId',
      'flow.amount': 'amount',
      'flow.businessId': 'businessId',
      'flow.channelSetId': 'channelSetId',
      'flow.payment.id': 'paymentId',
      'flow.payment.uuid': 'paymentUuid',
      'flow.payment.paymentType': 'paymentMethod',
    };

    for (const key in paymentCodeFields) {
      if (paymentCodeFields.hasOwnProperty(key)) {
        addData(update, paymentCode, key, paymentCodeFields[key]);
      }
    }

    if (paymentCode.address) {
      const addressFields = {
        'flow.billingAddress.firstName': 'firstName',
        'flow.billingAddress.lastName': 'lastName',
        'flow.billingAddress.email': 'email',
        'flow.billingAddress.country': 'countryName',
        'flow.billingAddress.city': 'city',
        'flow.billingAddress.zipCode': 'zipCode',
        'flow.billingAddress.street': 'street',
        'flow.billingAddress.phone': 'phoneNumber',
      };

      for (const key in addressFields) {
        if (addressFields.hasOwnProperty(key)) {
          addData(update, paymentCode.address, key, addressFields[key]);
        }
      }
    }

    if (Object.keys(update).length) {
      db._run('update', 'paymentcodes', {
        query: {_id: paymentCode._id},
        update: {$set: update},
      });
    }
  }
}

export async function down(): Promise<void> {}
