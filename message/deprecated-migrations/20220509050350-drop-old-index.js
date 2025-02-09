export async function up(db) {
  try {
    await db.removeIndex('folders', 'status_1');
    await db.removeIndex('folders', 'createdAt_1');
  } catch (e) { /* */ }
}

