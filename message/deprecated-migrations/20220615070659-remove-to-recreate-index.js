export async function up(db) {
  try {
    await db.removeIndex('profiles', 'username_1');
  } catch (e) { /* */ }
}
