Feature: Handle api call bus message events
  Scenario: Api call created event
    Given I remember as "apiCallId" following value:
    """
    "ff81d2be-124c-481d-8874-c3116d5af27a"
    """
    When I publish in RabbitMQ channel "async_events_payment_notifications_micro" message with json:
    """
    {
      "name": "checkout.event.api-call.created",
      "payload": {
        "id": "{{apiCallId}}",
        "businessId": "2382ffce-5620-4f13-885d-3c069f9dd9b4",
        "paymentMethod": "instant_payment",
        "channel": "api",
        "amount": 1000,
        "orderId": "sa45s454as399912343211",
        "currency": "EUR",
        "fee": 10,
        "cart": "[{\"name\":\"Apple AirPods\",\"sku\":\"888462858519\",\"price\":\"1000\",\"priceNetto\":\"1000.00\",\"vatRate\":\"0.00\",\"quantity\":1,\"description\":\"\",\"thumbnail\":\"https:\\/\\/eplehuset.no\\/static\\/version1524729916\\/webapi_rest\\/_view\\/nb_NO\\/Magento_Catalog\\/images\\/product\\/placeholder\\/.jpg\",\"url\":\"https:\\/\\/eplehuset.no\\/apple-airpods\"}]",
        "firstName": "weew",
        "lastName": "weew",
        "street": "sdfd",
        "city": "Vøyenenga",
        "zip": "13132",
        "country": "DE",
        "phone": "90212048",
        "email": "sdsd@sdds.eu",
        "successUrl": "https://payever.de/success",
        "pendingUrl": "https://payever.de/pending",
        "failureUrl": "https://payever.de/failure",
        "cancelUrl": "https://payever.de/cancel",
        "noticeUrl": "https://payever.de/notice",
        "customerRedirectUrl": "https://payever.de/customer-redirect",
        "extra": {
          "business_id": "2382ffce-5620-4f13-885d-3c069f9dd9b4"
        },
        "clientId": "876ba321-b3e0-4a54-8248-f7c8eecbebc7"
      }
    }
    """
    And process messages from RabbitMQ "async_events_payment_notifications_micro" channel
    Then model "ApiCall" with id "{{apiCallId}}" should contain json:
    """
    {
      "_id": "{{apiCallId}}",
      "successUrl": "https://payever.de/success",
      "pendingUrl": "https://payever.de/pending",
      "failureUrl": "https://payever.de/failure",
      "cancelUrl": "https://payever.de/cancel",
      "noticeUrl": "https://payever.de/notice",
      "customerRedirectUrl": "https://payever.de/customer-redirect",
      "businessId": "2382ffce-5620-4f13-885d-3c069f9dd9b4",
      "clientId": "876ba321-b3e0-4a54-8248-f7c8eecbebc7"
    }
    """

  Scenario: Api call migrate event
    Given I remember as "apiCallId" following value:
    """
    "ff81d2be-124c-481d-8874-c3116d5af27a"
    """
    When I publish in RabbitMQ channel "async_events_payment_notifications_micro" message with json:
    """
    {
      "name": "checkout.event.api-call.migrate",
      "payload": {
        "id": "{{apiCallId}}",
        "businessId": "2382ffce-5620-4f13-885d-3c069f9dd9b4",
        "paymentMethod": "instant_payment",
        "channel": "api",
        "amount": 1000,
        "orderId": "sa45s454as399912343211",
        "currency": "EUR",
        "fee": 10,
        "cart": "[{\"name\":\"Apple AirPods\",\"sku\":\"888462858519\",\"price\":\"1000\",\"priceNetto\":\"1000.00\",\"vatRate\":\"0.00\",\"quantity\":1,\"description\":\"\",\"thumbnail\":\"https:\\/\\/eplehuset.no\\/static\\/version1524729916\\/webapi_rest\\/_view\\/nb_NO\\/Magento_Catalog\\/images\\/product\\/placeholder\\/.jpg\",\"url\":\"https:\\/\\/eplehuset.no\\/apple-airpods\"}]",
        "firstName": "weew",
        "lastName": "weew",
        "street": "sdfd",
        "city": "Vøyenenga",
        "zip": "13132",
        "country": "DE",
        "phone": "90212048",
        "email": "sdsd@sdds.eu",
        "successUrl": "https://payever.de/success",
        "pendingUrl": "https://payever.de/pending",
        "failureUrl": "https://payever.de/failure",
        "cancelUrl": "https://payever.de/cancel",
        "noticeUrl": "https://payever.de/notice",
        "extra": {
          "business_id": "2382ffce-5620-4f13-885d-3c069f9dd9b4"
        },
        "clientId": "876ba321-b3e0-4a54-8248-f7c8eecbebc7"
      }
    }
    """
    And process messages from RabbitMQ "async_events_payment_notifications_micro" channel
    Then model "ApiCall" with id "{{apiCallId}}" should contain json:
    """
    {
      "_id": "{{apiCallId}}",
      "successUrl": "https://payever.de/success",
      "pendingUrl": "https://payever.de/pending",
      "failureUrl": "https://payever.de/failure",
      "cancelUrl": "https://payever.de/cancel",
      "noticeUrl": "https://payever.de/notice",
      "businessId": "2382ffce-5620-4f13-885d-3c069f9dd9b4",
      "clientId": "876ba321-b3e0-4a54-8248-f7c8eecbebc7"
    }
    """
