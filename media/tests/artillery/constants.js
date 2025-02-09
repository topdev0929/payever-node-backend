const businessId = '72ff06ba-b3f8-4c73-93e9-1d60b3f6b922';
const applicationId = 'f7e66c95-39c1-4761-94a9-c0650818db96';
const blobName = 'test-blob';
const videoContainer = 'builder-video';
const imageContainer = 'images';
const userId = '947924c2-72ad-4956-88be-11a4e73014b1';

const IMAGE = {
  businessId,
  container: imageContainer,
  blobName,
  userId
};

const VIDEO = {
  businessId,
  container: videoContainer,
  blobName
};

const ADMIN = {
  applicationId,
  containerName: videoContainer,
  businessId,
  blobName
}

const FILE = {
  applicationId,
  container: videoContainer,
  businessId,
  blobName
}

const CONFIG = {
  target: 'https://media.test.devpayever.com',
  variables: {
    authUrl: 'https://auth.test.devpayever.com',
    email: 'artillery@payever.de',
    plainPassword: 'Payever123!',
    businessId,
  },
};


module.exports = {
  IMAGE,
  VIDEO,
  ADMIN,
  FILE,
  CONFIG,
};
