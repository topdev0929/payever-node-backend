export async function up(db: any): Promise<void> {
  await removeNullId(db, 'businessproductaggregates');

  return null;
}

export async function down(db: any): Promise<any> {
  return null;
}

async function removeNullId(db: any, collection: string): Promise<void> {
  const AggregateData: any[] = await db._run('find', collection, { id: null });

  for (const data of AggregateData) {
    await db._run('remove', collection, { _id: data._id });
  }
}

module.exports.up = up;
module.exports.down = down;

