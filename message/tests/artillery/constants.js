const CONFIG = {
    target: 'wss://message-backend.test.devpayever.com/chat',
    variables: {
      authUrl: 'https://auth.test.devpayever.com',
      email: 'artillery@payever.de',
      plainPassword: 'Payever123!',
      businessId: 'edf56086-1655-44ec-b970-dfca17c4c967',
      userId: '2673fa45-82b9-484c-bcbe-46da250c2639',
      chatId: '15e9e846-3fba-4d09-bcb3-6431b4497ab2',
      httpTarget: 'https://message-backend.test.devpayever.com/api',
    },
    configFile: `${__dirname}/processors/config.js`,
    http: {
      timeout: 15,
    },
    default: {
      headers: {
        'content-type': "application/json",
        'user-agent': "Artillery (https://artillery.io)",
      },
    }  
  };  

  module.exports = {
    CONFIG,
  };