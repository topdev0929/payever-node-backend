import { folders } from '../fixtures/folders';

const folderCollection: string = 'Folder';

async function up(db: any): Promise<void>  {
  for (const entity of folders) {
    await db._run('insert', folderCollection, entity);
  }

  return null;
}

function down(): Promise<void>  {
  return null;
}

module.exports.up = up;
module.exports.down = down;
