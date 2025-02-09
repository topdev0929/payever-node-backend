export interface ThirdPartyConnection {
  authorizationId: string;
  business: {
    id: string;
  };
  connection: {
    id: string;
    name: string;
  };
  integration: {
    category: string;
    name: string;
  };
}
