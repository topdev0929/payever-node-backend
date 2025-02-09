export async function up(db: any): Promise<void> {
  await db._run('updateMany', 'dashboardapps', {
    query: { code: { $ne: 'transactions' } },
    update: {
      $set: {
        allowedAcls: {
          create: true,
          delete: true,
          read: true,
          update: true,
        },
      },
    },
  });

  await db._run('updateMany', 'dashboardapps', {
    query: { code: 'transactions' },
    update: {
      $set: {
        allowedAcls: {
          read: true,
          update: true,
        },
      },
    },
  });

  return null;
}

export function down(): void {}
