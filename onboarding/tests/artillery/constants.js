const TEMPLATE = {
  name: 'artillery-template',
};

const DEFAULT = {
  businessId: 'bd6d07d3-dce0-4287-9e2d-c37797006bce',
  oauth_businessId: '2382ffce-5620-4f13-885d-3c069f9dd9b4',
  adminAccessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiYmRjNjgzZDgtZTI4Zi00ZTQwLWE3NDItMjhmYjUxMDQ1NGNiIiwiZW1haWwiOiJhZG1pbi5kZWZhdWx0QHBheWV2ZXIuZGUiLCJmaXJzdE5hbWUiOiJBZG1pbiIsImxhc3ROYW1lIjoiRGVmYXVsdCIsImlzVmVyaWZpZWQiOnRydWUsInJvbGVzIjpbeyJwZXJtaXNzaW9ucyI6W10sIm5hbWUiOiJhZG1pbiIsImFwcGxpY2F0aW9ucyI6W119LHsicGVybWlzc2lvbnMiOltdLCJuYW1lIjoibWVyY2hhbnQiLCJhcHBsaWNhdGlvbnMiOltdfSx7InBlcm1pc3Npb25zIjpbXSwibmFtZSI6InVzZXIiLCJhcHBsaWNhdGlvbnMiOltdfV0sInRva2VuSWQiOiJhN2JjZGRmMy1hYzk1LTQ2MjYtOGVkNC1jYmI2NGZhNDM0MmQiLCJ0b2tlblR5cGUiOjEsImdlbmVyYWxBY2NvdW50Ijp0cnVlLCJjbGllbnRJZCI6bnVsbCwiaGFzaCI6IjljY2Y0Y2M2ZTVhZWY0ZGVjNjhmM2NhNWNkNzMzYmZjNzY1MjUzMmVkYjY5OGM1ZmFiY2VhNzVmYmRjZjdjNDkiLCJyZW1vdmVQcmV2aW91c1Rva2VucyI6ZmFsc2V9LCJpYXQiOjE2NTU5ODIxMjcsImV4cCI6MTc1NTk4MjEyN30.U9e24un10sFwy1_HhQG15tq35Ko5wj3ps1cFbr8WxjQ",
  client_id: 'client-id',
  client_secret: 'client-secret',
};

const CONFIG = {
  target: 'https://onboarding-backend.test.devpayever.com',
  variables: {
    authUrl: 'https://auth.test.devpayever.com',
    email: 'artillery@payever.de',
    plainPassword: 'Payever123!',
  },
  http: {
    timeout: 100,
  }
};
module.exports = {
  TEMPLATE,
  DEFAULT,
  CONFIG
};
