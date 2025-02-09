Feature: Api call flow
  Background:
    Given I am not authenticated
    Given I remember as "channelSetId" following value:
      """
      "006388b0-e536-4d71-b1f1-c21a6f1801e6"
      """
    Given I remember as "tokenId" following value:
    """
    "f24b7a60-69bf-43bd-bc2e-3859390a0f0e"
    """
    Given I generate a guest token remember it as "guestHash"
    Given I generate an access token using the following data and remember it as "guestToken":
    """
    {
      "guestHash": "{{guestHash}}",
      "roles": [
        {
          "name": "guest",
          "permissions": []
        }
      ],
      "tokenId": "{{tokenId}}"
    }
    """
    Given I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "post",
        "url": "https://auth.devpayever.com/api/guest-token",
        "body": "{\"ipHash\":\"*\"}"
      },
      "response": {
        "status": 200,
        "body": {
          "accessToken": "{{guestToken}}"
        }
      }
    }
    """
    Given I mock an axios request with parameters:
    """
    {
      "request": {
        "headers": {
         "Accept": "application/json, text/plain, */*"
        },
        "method": "get",
        "url": "*/translations/payment_option-en.json"
      },
      "response": {
        "status": 200,
        "body": {}
      }
    }
    """
  Scenario: Create api call flow
    Given I use DB fixture "legacy-api/api-call-flow/create/exists-channel-set-id"
    When I send a POST request to "/api/flow/v1" with json:
    """
    {
      "channelSetId": "{{channelSetId}}",
      "amount": 200,
      "paymentMethod": "santander_factoring_de",
      "reference": "test",
      "cart": [
        {
          "name": "Test item",
          "identifier": "123",
          "price": 150,
          "priceNetto": 0,
          "vatRate": 0,
          "quantity": 1
        },
        {
          "name": "Test item 2",
          "identifier": "456",
          "price": 50,
          "priceNetto": 0,
          "vatRate": 0,
          "quantity": 1
        }
      ],
      "successUrl": "http://test.com",
      "pendingUrl": "http://test.com",
      "cancelUrl": "http://test.com",
      "failureUrl": "http://test.com",
      "noticeUrl": "http://test.com"
    }
    """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
    """
    {
      "id": "*",
      "amount": 200,
      "currency": "EUR",
      "reference": "test",
      "total": 200,
      "cart": [
       {
         "identifier": "123",
         "name": "Test item",
         "price": 150,
         "quantity": 1
       },
       {
         "identifier": "456",
         "name": "Test item 2",
         "price": 50,
         "quantity": 1
       }
      ],
      "deliveryFee": 0,
      "posMerchantMode": false,
      "forceLegacyCartStep": false,
      "forceLegacyUseInventory": false,
      "state": "IN_PROGRESS",
      "apiCall": {
       "id": "*",
       "birthDate": null,
       "billingAddress": {},
       "shippingAddress": {
         "email": null,
         "phone": null
       }
      },
      "businessId": "012c165f-8b88-405f-99e2-82f74339a757",
      "businessName": "*",
      "channel": "finance_express",
      "channelSetId": "006388b0-e536-4d71-b1f1-c21a6f1801e6",
      "checkoutId": "04206b2a-a318-40e7-b031-32bbbd879c74",
      "paymentOptions": [],
      "guestToken": "{{guestToken}}"
    }
    """

  Scenario: Create api call flow without cart should force cart step flags to true
    Given I use DB fixture "legacy-api/api-call-flow/create/exists-channel-set-id"
    When I send a POST request to "/api/flow/v1" with json:
    """
    {
      "channelSetId": "{{channelSetId}}",
      "amount": 200,
      "paymentMethod": "santander_factoring_de",
      "reference": "test",
      "successUrl": "http://test.com",
      "pendingUrl": "http://test.com",
      "cancelUrl": "http://test.com",
      "failureUrl": "http://test.com",
      "noticeUrl": "http://test.com"
    }
    """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
    """
    {
      "id": "*",
      "amount": 200,
      "currency": "EUR",
      "reference": "test",
      "total": 200,
      "cart": [],
      "deliveryFee": 0,
      "posMerchantMode": false,
      "forceLegacyCartStep": true,
      "forceLegacyUseInventory": true,
      "state": "IN_PROGRESS",
      "apiCall": {
       "id": "*",
       "birthDate": null,
       "billingAddress": {},
       "shippingAddress": {
         "email": null,
         "phone": null
       }
      },
      "businessId": "012c165f-8b88-405f-99e2-82f74339a757",
      "businessName": "*",
      "channel": "finance_express",
      "channelSetId": "006388b0-e536-4d71-b1f1-c21a6f1801e6",
      "checkoutId": "04206b2a-a318-40e7-b031-32bbbd879c74",
      "paymentOptions": [],
      "guestToken": "{{guestToken}}"
    }
    """

  Scenario: Create api call flow with empty cart should force cart step flags to true
    Given I use DB fixture "legacy-api/api-call-flow/create/exists-channel-set-id"
    When I send a POST request to "/api/flow/v1" with json:
    """
    {
      "channelSetId": "{{channelSetId}}",
      "amount": 200,
      "cart": [],
      "paymentMethod": "santander_factoring_de",
      "reference": "test",
      "successUrl": "http://test.com",
      "pendingUrl": "http://test.com",
      "cancelUrl": "http://test.com",
      "failureUrl": "http://test.com",
      "noticeUrl": "http://test.com"
    }
    """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
    """
    {
      "id": "*",
      "amount": 200,
      "currency": "EUR",
      "reference": "test",
      "total": 200,
      "cart": [],
      "deliveryFee": 0,
      "posMerchantMode": false,
      "forceLegacyCartStep": true,
      "forceLegacyUseInventory": true,
      "state": "IN_PROGRESS",
      "apiCall": {
       "id": "*",
       "birthDate": null,
       "billingAddress": {},
       "shippingAddress": {
         "email": null,
         "phone": null
       }
      },
      "businessId": "012c165f-8b88-405f-99e2-82f74339a757",
      "businessName": "*",
      "channel": "finance_express",
      "channelSetId": "006388b0-e536-4d71-b1f1-c21a6f1801e6",
      "checkoutId": "04206b2a-a318-40e7-b031-32bbbd879c74",
      "paymentOptions": [],
      "guestToken": "{{guestToken}}"
    }
    """

  Scenario: Create api call flow with full flow request
    Given I use DB fixture "legacy-api/api-call-flow/create/exists-channel-set-id"
    Given I use DB fixture "legacy-api/integrations"
    Given I use DB fixture "legacy-api/connections"
    When I send a POST request to "/api/flow/v1" with json:
    """
    {
     "channelSetId": "{{channelSetId}}",
     "amount":200,
     "total":210,
     "currency":"EUR",
     "billingAddress":{
        "salutation":"SALUTATION_MR",
        "firstName":"Test",
        "lastName":"Test",
        "phone":null,
        "country":"DE",
        "city":"Meinerzhagen",
        "zipCode":"58540",
        "street":"Spitzenbergstraße 12",
        "streetName":null,
        "streetNumber":"",
        "email":"sdfsdf@asas.md",
        "addressLine2":null
     },
     "connectionId":"8275e4de-c4ed-4b87-a0e3-ebe678385c2a",
     "channel":"link",
     "cart": [
        {
          "name": "Test item",
          "identifier": "123",
          "price": 150,
          "priceNetto": 0,
          "vatRate": 0,
          "quantity": 1
        },
        {
          "name": "Test item 2",
          "identifier": "456",
          "price": 50,
          "priceNetto": 0,
          "vatRate": 0,
          "quantity": 1
        }
      ],
     "reference":"6a5sdasdasd",
     "deliveryFee":10,
     "forceLegacyCartStep":false,
     "forceLegacyUseInventory":false,
     "coupon":null
    }
    """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
    """
    {
     "id": "*",
     "amount": 200,
     "currency": "EUR",
     "reference": "6a5sdasdasd",
     "total": 210,
     "cart": [
       {
         "identifier": "123",
         "name": "Test item",
         "price": 150,
         "quantity": 1
       },
       {
         "identifier": "456",
         "name": "Test item 2",
         "price": 50,
         "quantity": 1
       }
     ],
     "billingAddress": {
       "city": "Meinerzhagen",
       "country": "DE",
       "email": "sdfsdf@asas.md",
       "firstName": "Test",
       "lastName": "Test",
       "phone": null,
       "salutation": "SALUTATION_MR",
       "street": "Spitzenbergstraße 12",
       "streetName": null,
       "streetNumber": "",
       "zipCode": "58540"
     },
     "deliveryFee": 10,
     "posMerchantMode": false,
     "coupon": null,
     "forceLegacyCartStep": false,
     "forceLegacyUseInventory": false,
     "state": "IN_PROGRESS",
     "apiCall": {
       "id": "*",
       "birthDate": null,
       "billingAddress": {},
       "shippingAddress": {
         "email": null,
         "phone": null
       }
     },
     "businessId": "012c165f-8b88-405f-99e2-82f74339a757",
     "businessName": "Business*",
     "channel": "finance_express",
     "channelSetId": "{{channelSetId}}",
     "checkoutId": "*",
     "connectionId": "8275e4de-c4ed-4b87-a0e3-ebe678385c2a",
     "paymentOptions": [],
     "guestToken": "{{guestToken}}"
   }
  """
