export interface ElasticExtraData {
  elasticIds: ElasticIds;
  targetFolderId: string;
}

export interface ElasticIds {
  applicationScopeId?: string;
  businessScopeId?: string;
  userScopeId?: string;
}
