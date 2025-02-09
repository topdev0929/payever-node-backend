export async function up(db: any): Promise<void> {
  await db.dropCollection('businessdashboardapps');
  await db.dropCollection('userdashboardapps');
}
