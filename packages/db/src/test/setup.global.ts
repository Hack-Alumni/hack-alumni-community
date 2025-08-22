import { db } from '../shared/db';
import { migrate } from '../use-cases/migrate';

export async function setup() {
  // Skip migrations in CI environment since the database should already be migrated
  if (!process.env.CI) {
    await migrate({ db });
  }
}

export async function teardown() {
  await db.destroy();
}
