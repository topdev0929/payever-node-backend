import { widgetsFixture } from '../fixtures/widgets.fixture';

export async function up(db: any): Promise<void> {
  for (const widget of widgetsFixture) {
    await db._run(
      'update',
      'widgets',
      {
        query: {
          _id: widget._id,
        },
        update: {
          $set: {
            order: widget.order,
          },
        },
      },
    );
  }

  return null;
}

export async function down(db: any): Promise<any> {
  return null;
}

module.exports.up = up;
module.exports.down = down;

