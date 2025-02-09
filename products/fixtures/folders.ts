import { Folder, ScopeEnum } from '@pe/folders-plugin';

export const IMPORT_LIST_FOLDER_ID: string = 'e9cb0388-a3e5-463b-a8c9-10166d752106';
export const PAYEVER_MARKET_FOLDER_ID: string = '32006f8d-46cb-44c7-8a72-9709b0c77c0c';

export const FOLDERS: Array<Omit<Folder, 'parentFolderId'>> = [
  {
    _id: IMPORT_LIST_FOLDER_ID,
    isHeadline: false,
    isProtected: true,
    name: 'Import List',
    position: 1,
    scope: ScopeEnum.Default,
  },
  {
    _id: PAYEVER_MARKET_FOLDER_ID,
    isHeadline: false,
    isProtected: true,
    name: 'payever Market',
    position: 2,
    scope: ScopeEnum.Default,
  },
];
