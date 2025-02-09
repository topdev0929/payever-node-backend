Feature: Create flow by ApiCall
  Background:
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
    Given I remember as "checkoutId" following value:
      """
      "04206b2a-a318-40e7-b031-32bbbd879c74"
      """
    Given I remember as "channelSetId" following value:
      """
      "006388b0-e536-4d71-b1f1-c21a6f1801e6"
      """
    Given I remember as "apiCallId" following value:
      """
      "b5965f9d-5971-4b02-90eb-537a0a6e07c7"
      """
    Given I remember as "paymentMethod" following value:
      """
      "santander"
      """
    Given I remember as "orderId" following value:
      """
      "some_order_id"
      """
    Given I remember as "payeverSession" following value:
      """
      "session_value"
      """

  Scenario: Create flow for widget
    Given I use DB fixture "legacy-api/api-call/start-checkout/normal/exists-channel-set-id-and-channel"
    When I send a POST request to "/api/flow/v1/api-call/{{apiCallId}}"
    Then print last response
    And the response status code should be 201
    And response should contain json:
    """
    {
      "id":"*",
      "guestToken":"{{guestToken}}",
      "amount":1000
    }
    """

  Scenario: Create flow for checkout
    Given I use DB fixture "legacy-api/api-call/start-checkout/normal/exists-channel-set-id-and-channel"
    When I send a POST request to "/api/flow/v1/api-call/{{apiCallId}}"
    Then print last response
    And the response status code should be 201
    And response should contain json:
    """
    {
      "id":"*",
      "guestToken":"{{guestToken}}",
      "amount": 1000,
      "downPayment": 0,
      "currency": "EUR",
      "reference": "some_order_id",
      "total": 1000,
      "cart": [
         {
           "identifier": "iph123",
           "name": "iPhone",
           "price": 1010,
           "quantity": 1,
           "totalDiscountAmount": 10,
           "type": "physical"
         }
      ],
      "billingAddress": {
        "addressLine2": "package station",
        "city": "Hamburg",
        "country": "DE",
        "firstName": "Test",
        "lastName": "Test",
        "salutation": "SALUTATION_MR",
        "street": "Feldstrasse 21",
        "zipCode": "12345"
      },
      "deliveryFee": 0,
      "posMerchantMode": false,
      "forceLegacyCartStep": false,
      "forceLegacyUseInventory": false,
      "extra": {},
      "state": "IN_PROGRESS",
      "apiCall": {
       "id": "b5965f9d-5971-4b02-90eb-537a0a6e07c7",
       "birthDate": null,
       "billingAddress": {
          "addressLine2": "package station",
          "city": "Hamburg",
          "country": "DE",
          "firstName": "Test",
          "lastName": "Test",
          "salutation": "",
          "street": "Feldstrasse 21",
          "zipCode": "12345"
       },
       "shippingAddress": {
         "email": null,
         "phone": null
       },
       "company": {},
       "shippingOption": {
         "details": {
           "pickupLocation": {
             "address": {}
           }
         }
       },
       "splits": [],
       "allowCustomerTypes": []
      },
      "businessId": "*",
      "businessName": "Business*",
      "businessAddressLine": "",
      "businessType": "mixed",
      "channel": "magento",
      "hideImprint": true,
      "hideLogo": true,
      "footerUrls": {
        "disclaimer": "https://disclaimer.url",
        "logo": "https://logo.url",
        "privacy": "https://privacy.url",
        "support": "https://support.url"
      }
    }
    """

  Scenario: Create flow with disabled validation
    Given I use DB fixture "legacy-api/api-call/start-checkout/normal/disable-validation"
    When I send a POST request to "/api/flow/v1/api-call/{{apiCallId}}"
    Then print last response
    And the response status code should be 201
    And response should contain json:
    """
    {
      "id":"*",
      "guestToken":"{{guestToken}}",
      "amount": 1000,
      "downPayment": 0,
      "currency": "EUR",
      "reference": "some_order_id",
      "total": 1000,
      "cart": [
         {
           "identifier": "iph123",
           "name": "iPhone",
           "price": 1010,
           "quantity": 1,
           "totalDiscountAmount": 10,
           "type": "physical"
         }
      ],
      "billingAddress": {
        "addressLine2": "package station",
        "city": "Hamburg",
        "country": "DE",
        "firstName": "Test",
        "lastName": "Test",
        "salutation": "SALUTATION_MR",
        "street": "Feldstrasse 21",
        "zipCode": "12345"
      },
      "deliveryFee": 0,
      "posMerchantMode": false,
      "forceLegacyCartStep": false,
      "forceLegacyUseInventory": false,
      "extra": {},
      "state": "IN_PROGRESS",
      "apiCall": {
       "id": "b5965f9d-5971-4b02-90eb-537a0a6e07c7",
       "birthDate": null,
       "billingAddress": {
          "addressLine2": "package station",
          "city": "Hamburg",
          "country": "DE",
          "firstName": "Test",
          "lastName": "Test",
          "salutation": "",
          "street": "Feldstrasse 21",
          "zipCode": "12345"
       },
       "shippingAddress": {
         "email": null,
         "phone": null
       },
       "company": {},
       "shippingOption": {
         "details": {
           "pickupLocation": {
             "address": {}
           }
         }
       },
       "splits": [],
       "allowCustomerTypes": []
      },
      "businessId": "*",
      "businessName": "Business*",
      "businessAddressLine": "",
      "businessType": "mixed",
      "channel": "magento",
      "disableValidation": true,
      "hideImprint": true,
      "hideLogo": true,
      "footerUrls": {
        "disclaimer": "https://disclaimer.url",
        "logo": "https://logo.url",
        "privacy": "https://privacy.url",
        "support": "https://support.url"
      }
    }
    """
