export async function up(db: any): Promise<void> {
  const terminals = await db._run('find', 'terminals', {});

  for (const terminal of terminals) {
    if (terminal.checkoutId) {
      const update: any = {
        _id: terminal.checkoutId,
      };

      if (terminal.message) {
        update.message = terminal.message;
      }

      if (terminal.phoneNumber) {
        update.phoneNumber = terminal.phoneNumber;
      }

      await db._run('update', 'checkouts', {
        query: {_id: terminal.checkoutId},
        update: {
          $set: update,
        },
        options: {upsert: true},
      });

      await db._run('update', 'terminals', {
        query: {_id: terminal._id},
        update: {
          $set: {checkout: terminal.checkoutId},
          $unset: {checkoutId: '', phoneNumber: '', message: ''},
        },
      });
    }
  }
}

export async function down(): Promise<void> {}
