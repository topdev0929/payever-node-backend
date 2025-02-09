import { ShopSteps } from '../fixtures/shop-steps.fixture';

export async function up(db: any): Promise<void> {
  for (const step of ShopSteps) {
    await db.insert('defaultsteps', step);
  }
}

export function down(): void {}
