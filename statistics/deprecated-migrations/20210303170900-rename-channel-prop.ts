import { widgetsPropsFixture } from '../fixtures/widgets-props.fixture';

const widgetPropsCollection = 'widgetprops';

export async function up(db: any): Promise<void> {
  try {
    await db.dropCollection(widgetPropsCollection);
  } catch { }
  for (const widgetProps of widgetsPropsFixture) {
    await db.insert(widgetPropsCollection, widgetProps);
  }
}

export async function down(): Promise<void> {}
