export async function up(db: any): Promise<void> {
  await db._run('updateMany', 'dashboardapps', {
    query: { code: { $ne: 'transactions' } },
    update: {
      $set: {
        allowedAcls: {
          aclCreate: true,
          aclDelete: true,
          aclRead: true,
          aclUpdate: true,
        },
      },
    },
  });

  await db._run('updateMany', 'dashboardapps', {
    query: { code: 'transactions' },
    update: {
      $set: {
        allowedAcls: {
          aclRead: true,
          aclUpdate: true,
        },
      },
    },
  });

  return null;
}

export function down(): void {}
