export async function up(db: any): Promise<void> {
  await db.addIndex('users', null, ['email'], true);
}

export async function down(): Promise<void> { }
