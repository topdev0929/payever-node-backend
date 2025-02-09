export async function up(db: any): Promise<void> {
  await db._run('update', 'users', {
    options: { multi: true },
    query: { },
    update: { $rename: { secondFactor: 'secondFactorRequired' } },
  });
}

export async function down(): Promise<void> { }
