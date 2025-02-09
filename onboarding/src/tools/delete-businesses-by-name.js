/* tslint:disable */
/**
 * @description Script to delete businesses by name pattern after non proper onboarding
 * @env Browser console
 */
(async () => {
  const baseDomain = 'test.devpayever.com';
  // const baseDomain = 'staging.devpayever.com';
  // const baseDomain = 'payever.org';
  const businessNameRe = /b\-/;
  const cookies = document.cookie.split('; ').reduce((acc, curr) => {
    const [key, value] = curr.split('=');
    acc[key] = value;
    return acc;
  }, {});
  const token = cookies['pe_auth_token'];
  const query = await fetch(`https://users.${baseDomain}/api/business?limit=3000`, {
    method: 'GET',
    headers: new Headers({
      Authorization: `Bearer ${token}`,
    }),
  });
  const response = await query.json();
  let deleted = 0;
  for (const business of response.businesses) {
    if (businessNameRe.test(business.name)) {
      console.debug('BUSINESS DELETING', business._id, business);
      const query = await fetch(`https://auth.${baseDomain}/api/business/${business._id}/enable`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const enableBusinessResponse = await query.json();
      const businessSpecificToken = enableBusinessResponse.accessToken;
      await fetch(`https://users.${baseDomain}/api/business/${business._id}`, {
        method: 'DELETE',
        headers: new Headers({
          Authorization: `Bearer ${businessSpecificToken}`,
        }),
      });
      console.debug('BUSINESS DELETED', business._id, business.name);
      deleted++;
    }
  }
  console.log(`Processed ${deleted} of ${response.businesses.length}`);
  console.log('All Done');
})().catch(e => {
  console.error(e);
});
