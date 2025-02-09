const WIDGETS_VARS = {
    amountLimits: {
        max: 200,
        min: 10,
    },
    checkoutId: "2d873385-5c32-479c-a830-26de40bd4fd1",
    checkoutMode: "none",
    checkoutPlacement: "rightSidebar",
    isVisible: true,
    maxWidth: 200,
    minWidth: 10,
    payments: {
        paymentMethod: "santander_installment",
        connectionId: "167234e4-00c8-4301-87fe-d75a81bf1165",
        amountLimits: {
            max: 2000,
            min: 10,
        },
        enabled: true,
        isBNPL: true,
        productId: "456"
    },
    ratesOrder: "asc",
    styles: {},
    type: "type-test",
    cancelUrl: "cancelUrl.com",
    failureUrl: "failureUrl.com",
    noticeUrl: "noticeUrl.com",
    pendingUrl: "pendingUrl.com",
    successUrl: "successUrl.com",
    widgetId: 'b33845b0-9798-4980-ae0c-8585b1cef2cb',
    widgetType: "test-type"
};

const CHANNEL_VARS = {
    channelId: 'f94f434d-6b16-4456-a9fc-c5b8c9be381f',
    channelSetId: 'ade7b352-64df-43f7-95e1-1a49eccd0f8b',
    channelType: 'finance-express',
    legacyLegacyId: 123,
};

const CONFIG = {
    target: 'https://finance-express-backend.test.devpayever.com',
    variables: {
        authUrl: 'https://auth.test.devpayever.com',
        email: 'artillery@payever.de',
        plainPassword: 'Payever123!',
        businessId: '72ff06ba-b3f8-4c73-93e9-1d60b3f6b922',
    },
    http: {
        timeout: 15,
    },
    configFile: `${__dirname}/processors/config.js`,
};

module.exports = {
    WIDGETS_VARS,
    CHANNEL_VARS,
    CONFIG,
};
