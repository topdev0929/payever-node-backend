import { ScopeEnum } from '@pe/folders-plugin';

export const ARCHIVE_FOLDER_ID: string = '9d10611a-f4f7-497d-a677-96812183f942';

export const FOLDERS: any[] = [
  {
    _id: ARCHIVE_FOLDER_ID,
    isFolder: true,
    isHeadline: false,
    isProtected: true,
    name: 'transactions.folder-name.archive',
    position: 1,
    scope: ScopeEnum.Default,
  },
];
