import { OAuthClient } from '../src/oauth/interfaces';

export async function up(db: any): Promise<void> {
  const oauthClients: Array<OAuthClient & { businessId: string}> = await db._run('find', 'oauthclients', { });

  for (const oauthClient of oauthClients) {
    if (!!oauthClient.businessId) {
      (oauthClient as any).businesses = [oauthClient.businessId];
      await db._run('update', 'oauthclients', { query: { _id: oauthClient._id}, update: oauthClient});
    }
  }
}

export async function down(): Promise<void> { }
