export enum WebsocketMessagesEnum {
  CreateAlbum = 'create.album',
  UpdateAlbum = 'update.album',
  ListAlbums = 'list.albums',
  GetAlbum = 'get.album',
  DeleteAlbum = 'delete.album',
  GetAlbumsByParent = 'get.albums.by.parent',
  GetAlbumsByAncestor = 'get.albums.by.ancestor',
  GetAlbumsByAttribute = 'get.albums.by.attribute',
  GetAlbumsByMultipleAttributes = 'get.albums.by.multiple.attributes',
  DuplicateAlbums = 'duplicate.albums',
}
