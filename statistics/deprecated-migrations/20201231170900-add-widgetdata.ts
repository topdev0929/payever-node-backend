import { widgetsPropsFixture } from '../fixtures/widgets-props.fixture';

const widgetPropsCollection = 'widgetproperties';

export async function up(db: any): Promise<void> {
  for (const widgetProps of widgetsPropsFixture) {
    await db.insert(widgetPropsCollection, widgetProps);
  }
}

export async function down(): Promise<void> {}
