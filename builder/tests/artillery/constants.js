const ApplicationThemeAlbum = {
  businessId: '15278f88-9439-4ca5-a214-40b1cbc36ba7',
  applicationId: 'a6acd1b3-9953-446f-be49-e38d994c89ff',
  albumId: 'ab8c8c14-1bd0-4a3a-842b-032b7fbfae77',
  albumName: "new album",
  albumNameUpdated: "album name updated",
  albumDescription: "new album description",
  integrationId: "f81d0a0e-0352-4973-b5af-76beff677882",
  integrationContextId: "8576949a-1f9f-4228-a7e8-b4812dcabb00",
  integrationUniqueTag: "payever.product.get.for.builder",
};

const ApplicationTheme = {
  themeId: "b17c4b88-8ba5-4ead-881b-b1b53271a634",
  applicationThemeId: "cc64b90f-6b63-43f5-ad65-aaca10dda326",
}

const PageAlbum = {
  pageAlbumId: "7d8b6bc3-a295-4edb-ba06-bff8f1c9351b",
  pageId: "dc573f17-dd4a-4929-9aad-34099c5e5380",
}

const Script = {
  scriptId1: "a3d3bba3-1bef-483d-a0dc-000000000171",
  scriptId2: "a3d3bba3-1bef-483d-a0dc-000000000172",
}

const Folder = {
  folderId: "52d2d663-a10e-4a6d-babd-3f624b83d433",
}

const Integrations = {
}

const Shape = {
  shapeAlbumId: "15e2deba-1364-4115-b18a-4bcee0041008",
  shapeTemplateAlbumId: "2d2d7bb6-a4ab-4ea9-8a85-263b172ac48b",
  shapeTemplateParentAlbumId: "0fe10ef0-b896-49b0-a5d7-13146ec5f6ee",
  shapeId: "cd11375c-3768-4c9d-b13f-d2fa81f8736a",
  templateShapeId: "fd660311-795b-4c68-b19d-a631fb2ebc46",
}

const Snippet = {
  snippetId: "d9d7233c-abd0-46eb-8701-c5b66f0ea895",
}

const TemplateThemes = {
  templateThemeId: "2b2d190e-6dbb-495a-a023-b65a94e6ec9b",
  templateThemeItemId: "9562f67c-a62b-44a5-a048-c7125eb79325",
  templateGroupId: "843ec58d-122a-45b5-880d-52f58351511c",
}

const Versions = {
  versionId: "3105e8c1-fa97-4af9-81ff-5f1c40255a24",
}

const DEFAULT = {
  businessId: '15278f88-9439-4ca5-a214-40b1cbc36ba7',
  channelSetId: 'c2c58c76-7bf8-49be-b2fa-3f50fd590c08',
};

const CONFIG = {
  configFile: `../processor.js`,
  // target: 'https://builder-shops.test.devpayever.com',
  target: 'http://localhost:3033',
  variables: {
    // authUrl: 'https://auth.test.devpayever.com',
    authUrl: 'http://localhost:3009',
    email: 'artillery@payever.de',
    emailAdmin: 'artillery-admin@payever.de',
    plainPassword: 'Payever123!',
    businessId: '15278f88-9439-4ca5-a214-40b1cbc36ba7',
  },
  http: {
    timeout: 15,
  }
};

module.exports = {
  ApplicationThemeAlbum,
  ApplicationTheme,
  PageAlbum,
  Folder,
  Integrations,
  Script,
  Shape,
  Snippet,
  TemplateThemes,
  Versions,
  CONFIG,
};
