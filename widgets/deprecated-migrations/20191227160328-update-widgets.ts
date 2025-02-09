async function upMigrate(db: any): Promise<any> {
  await db._run('update', 'widgets', {
    query: { icon: 'icon-commerceos-studio.png'},
    update: { $set: { icon: 'icon-commerceos-studio-64.png'}},
  });

  await db._run('update', 'widgets', {
    query: { icon: 'icon-commerceos-ads.png'},
    update: { $set: { icon: 'icon-commerceos-ad-64.png'}},
  });

  await db._run('update', 'widgets', {
    query: { icon: 'icon-shipping-64.png '},
    update: { $set: { icon: 'icon-commerceos-shipping-64.png'}},
  });

  return null;
}

function downMigrate(): any {
  return null;
}

module.exports.up = upMigrate;
module.exports.down = downMigrate;
