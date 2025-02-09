@flow
Feature: Checkout flow management
  Background:
    Given I remember as "businessId" following value:
    """
    "012c165f-8b88-405f-99e2-82f74339a757"
    """
    Given I remember as "channelSetId" following value:
    """
    "006388b0-e536-4d71-b1f1-c21a6f1801e6"
    """
    Given I remember as "tokenId" following value:
    """
    "f24b7a60-69bf-43bd-bc2e-3859390a0f0e"
    """
    Given I remember as "registeredTokenId" following value:
    """
    "4d11076a-6889-417a-845d-3ef7b208560d"
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
    Given I generate an access token using the following data and remember it as "registeredToken":
    """
    {
      "email": "email@test.com",
      "roles": [
        {
          "name": "merchant",
          "permissions": [
            {
              "businessId": "{{businessId}}",
              "acls": []
            }
          ]
        }
      ],
      "tokenId": "{{registeredTokenId}}"
    }
    """

  Scenario: Start flow
    Given I am not authenticated
    And I use DB fixture "flow/flow/v1/integrations"
    And I use DB fixture "flow/flow/v1/businesses"
    And I use DB fixture "flow/flow/v1/business-integration-subs"
    And I use DB fixture "flow/flow/v1/checkouts"
    And I use DB fixture "flow/flow/v1/checkout-integration-subs"
    And I use DB fixture "flow/flow/v1/channel-sets"
    And I use DB fixture "flow/flow/v1/connections"
    And I mock an axios request with parameters:
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
    When I send a POST request to "/api/flow/v1" with json:
    """
    {
      "channelSetId": "{{channelSetId}}"
    }
    """
    And the response status code should be 201
    Then I get "apiCall.id" from response and remember as "apiCallId"
    And print last response
    And the response should contain json:
    """
    {
       "id": "*",
       "amount": 0,
       "downPayment": 0,
       "currency": "EUR",
       "total": 0,
       "cart": [],
       "deliveryFee": 0,
       "posMerchantMode": false,
       "forceLegacyCartStep": true,
       "forceLegacyUseInventory": true,
       "state": "IN_PROGRESS",
       "businessId": "*",
       "businessName": "Test business",
       "businessCountry": "DE",
       "businessIban": "test_iban",
       "businessAddressLine": "Qwerty, 12345, Hamburg, DE",
       "businessType": "mixed",
       "channel": "magento",
       "channelSetId": "{{channelSetId}}",
       "checkoutId": "*",
       "apiCall": {
         "id": "{{apiCallId}}",
         "birthDate": null,
         "billingAddress": {},
         "cancelUrl": "https://callback.com/canceled/{{apiCallId}}",
         "shippingAddress": {
           "email": null,
           "phone": null
         }
       },
       "paymentOptions": [
         {
           "name": "paypal.name",
           "paymentMethod": "paypal",
           "max": 10000,
           "min": 0.02,
           "fixedFee": 0.35,
           "variableFee": 1.9,
           "shareBagEnabled": true,
           "connections": [
             {
               "id": "765228ec-afb0-4465-b471-83e8521a4ef3",
               "name": "Paypal main",
               "merchantCoversFee": true,
               "shippingAddressAllowed": true,
               "shippingAddressEquality": false,
               "version": "default"
             },
             {
               "id": "aaa794cc-6dbd-4087-aaed-fc37817cb919",
               "name": "Paypal extra",
               "merchantCoversFee": false,
               "shippingAddressAllowed": true,
               "shippingAddressEquality": true,
               "version": "default"
             }
           ]
         },
         {
           "name": "santander_installment.name",
           "paymentMethod": "santander_installment",
           "max": 100000,
           "min": 99,
           "fixedFee": 0,
           "variableFee": 0,
           "connections": [
             {
               "id": "2dd4d7e2-3e6d-44fc-a78b-7acfa2977794",
               "name": "Santander DE",
               "merchantCoversFee": false,
               "shippingAddressAllowed": false,
               "shippingAddressEquality": false,
               "version": "default"
             }
           ]
         }
       ],
       "guestToken": "{{guestToken}}"
    }
    """
    Then print RabbitMQ exchange "async_events" message list
    And the RabbitMQ exchange "async_events" should contain following messages:
    """
    [
      {
         "name": "checkout.event.api-call.created",
         "payload": {
           "id": "*",
           "businessId": "012c165f-8b88-405f-99e2-82f74339a757",
           "channel": "magento",
           "channelSetId": "006388b0-e536-4d71-b1f1-c21a6f1801e6",
           "currency": "EUR",
           "fee": 0,
           "downPayment": 0,
           "cancelUrl": "https://callback.com/canceled/--CALL-ID--",
           "createdAt": "*",
           "updatedAt": "*"
         }
       },
       {
         "name": "checkout.event.payment-flow.created",
         "payload": {
           "flow": {
             "id": "*",
             "amount": 0,
             "api_call_create_id": "*",
             "business_id": "012c165f-8b88-405f-99e2-82f74339a757",
             "channel_set_uuid": "006388b0-e536-4d71-b1f1-c21a6f1801e6",
             "currency": "EUR",
             "shipping_fee": 0,
             "state": "IN_PROGRESS"
           }
         }
       }
    ]
    """
    Then I get "id" from response and remember as "flowId"
    Then I send a GET request to "/api/flow/v1/{{flowId}}"
    And the response status code should be 403
    Then I authenticate as a user with the following data:
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
    Then I send a GET request to "/api/flow/v1/{{flowId}}"
    And the response status code should be 200
    And the response should contain json:
    """
    {
       "id": "{{flowId}}",
       "amount": 0,
       "downPayment": 0,
       "currency": "EUR",
       "total": 0,
       "cart": [],
       "deliveryFee": 0,
       "posMerchantMode": false,
       "forceLegacyCartStep": true,
       "forceLegacyUseInventory": true,
       "state": "IN_PROGRESS",
       "businessId": "*",
       "businessName": "Test business",
       "businessCountry": "DE",
       "channel": "magento",
       "channelSetId": "{{channelSetId}}",
       "checkoutId": "*",
       "paymentOptions": [
         {
           "name": "paypal.name",
           "paymentMethod": "paypal",
           "max": 10000,
           "min": 0.02,
           "fixedFee": 0.35,
           "variableFee": 1.9,
           "connections": [
             {
               "id": "765228ec-afb0-4465-b471-83e8521a4ef3",
               "name": "Paypal main",
               "merchantCoversFee": true,
               "shippingAddressAllowed": true,
               "shippingAddressEquality": false
             },
             {
               "id": "aaa794cc-6dbd-4087-aaed-fc37817cb919",
               "name": "Paypal extra",
               "merchantCoversFee": false,
               "shippingAddressAllowed": true,
               "shippingAddressEquality": true
             }
           ]
         }
       ]
    }
    """
    Then I send a PATCH request to "/api/flow/v1/{{flowId}}" with json:
    """
    {
      "amount": 100,
      "downPayment": 10,
      "connectionId": "765228ec-afb0-4465-b471-83e8521a4ef3",
      "billingAddress": {
        "country": "DE",
        "city": "Hamburg",
        "street": "Test 1",
        "streetNumber": "1",
        "streetName": "Test",
        "zipCode": "12345",
        "firstName": "First",
        "lastName": "Last",
        "email": "test@test.com",
        "organizationName": "test_org",
        "houseExtension": "test_ext"
      },
      "company": {
        "externalId": "test_company_id",
        "name": "Test company"
      },
      "customerType": "organization"
    }
    """
    And the response status code should be 200
    And the response should contain json:
    """
    {
       "id": "{{flowId}}",
       "amount": 100,
       "downPayment": 10,
       "currency": "EUR",
       "reference": "*",
       "total": 100,
       "cart": [],
       "deliveryFee": 0,
       "posMerchantMode": false,
       "forceLegacyCartStep": true,
       "forceLegacyUseInventory": true,
       "state": "IN_PROGRESS",
       "businessId": "*",
       "businessName": "Test business",
       "businessCountry": "DE",
       "channel": "magento",
       "channelSetId": "{{channelSetId}}",
       "checkoutId": "*",
       "connectionId": "765228ec-afb0-4465-b471-83e8521a4ef3",
       "billingAddress": {
          "country": "DE",
          "city": "Hamburg",
          "street": "Test 1",
          "streetNumber": "1",
          "streetName": "Test",
          "zipCode": "12345",
          "firstName": "First",
          "lastName": "Last",
          "email": "test@test.com",
          "organizationName": "test_org",
          "houseExtension": "test_ext"
       },
       "company": {
         "externalId": "test_company_id",
         "name": "Test company"
       },
       "customerType": "organization",
       "paymentOptions": [
         {
           "name": "paypal.name",
           "paymentMethod": "paypal",
           "max": 10000,
           "min": 0.02,
           "fixedFee": 0.35,
           "variableFee": 1.9,
           "connections": [
             {
               "id": "765228ec-afb0-4465-b471-83e8521a4ef3",
               "name": "Paypal main",
               "merchantCoversFee": true,
               "shippingAddressAllowed": true,
               "shippingAddressEquality": false
             },
             {
               "id": "aaa794cc-6dbd-4087-aaed-fc37817cb919",
               "name": "Paypal extra",
               "merchantCoversFee": false,
               "shippingAddressAllowed": true,
               "shippingAddressEquality": true
             }
           ]
         }
       ]
    }
    """
    Then print RabbitMQ exchange "async_events" message list
    And the RabbitMQ exchange "async_events" should contain following messages:
    """
    [
      {
         "name": "checkout.event.payment-flow.updated",
         "payload": {
           "flow": {
             "id": "{{flowId}}",
             "amount": 100,
             "down_payment": 10,
             "api_call_create_id": "*",
             "business_id": "012c165f-8b88-405f-99e2-82f74339a757",
             "business_payment_option_uuid": "765228ec-afb0-4465-b471-83e8521a4ef3",
             "channel_set_uuid": "006388b0-e536-4d71-b1f1-c21a6f1801e6",
             "currency": "EUR",
             "reference": "*",
             "shipping_fee": 0,
             "state": "IN_PROGRESS",
             "payment_method": "paypal",
             "billing_address": {
               "city": "Hamburg",
               "country": "DE",
               "email": "test@test.com",
               "first_name": "First",
               "last_name": "Last",
               "street": "Test 1",
               "street_name": "Test",
               "street_number": "1",
               "zip_code": "12345"
             }
           }
         }
       }
    ]
    """
    Then I send a PATCH request to "/api/flow/v1/{{flowId}}" with json:
    """
    {
      "amount": 200,
      "downPayment": 10,
      "deliveryFee": "50",
      "reference": "test_ref"
    }
    """
    And the response status code should be 200
    And the response should contain json:
    """
    {
       "id": "{{flowId}}",
       "amount": 200,
       "downPayment": 10,
       "currency": "EUR",
       "reference": "test_ref",
       "total": 250,
       "cart": [],
       "deliveryFee": 50,
       "posMerchantMode": false,
       "forceLegacyCartStep": true,
       "forceLegacyUseInventory": true,
       "state": "IN_PROGRESS",
       "businessId": "*",
       "businessName": "Test business",
       "businessCountry": "DE",
       "channel": "magento",
       "channelSetId": "{{channelSetId}}",
       "checkoutId": "*",
       "connectionId": "765228ec-afb0-4465-b471-83e8521a4ef3",
       "paymentOptions": [
         {
           "name": "paypal.name",
           "paymentMethod": "paypal",
           "max": 10000,
           "min": 0.02,
           "fixedFee": 0.35,
           "variableFee": 1.9,
           "connections": [
             {
               "id": "765228ec-afb0-4465-b471-83e8521a4ef3",
               "name": "Paypal main",
               "merchantCoversFee": true,
               "shippingAddressAllowed": true,
               "shippingAddressEquality": false
             },
             {
               "id": "aaa794cc-6dbd-4087-aaed-fc37817cb919",
               "name": "Paypal extra",
               "merchantCoversFee": false,
               "shippingAddressAllowed": true,
               "shippingAddressEquality": true
             }
           ]
         }
       ]
    }
    """
    Then I send a PATCH request to "/api/flow/v1/{{flowId}}/mark-as-finished" with json:
    """
    { }
    """
    And the response status code should be 200
    And the response should contain json:
    """
    {
       "id": "{{flowId}}",
       "amount": 200,
       "downPayment": 10,
       "currency": "EUR",
       "reference": "test_ref",
       "total": 250,
       "cart": [],
       "deliveryFee": 50,
       "posMerchantMode": false,
       "forceLegacyCartStep": true,
       "forceLegacyUseInventory": true,
       "state": "FINISHED",
       "businessId": "*",
       "businessName": "Test business",
       "businessCountry": "DE",
       "channel": "magento",
       "channelSetId": "{{channelSetId}}",
       "checkoutId": "*",
       "connectionId": "765228ec-afb0-4465-b471-83e8521a4ef3",
       "paymentOptions": [
         {
           "name": "paypal.name",
           "paymentMethod": "paypal",
           "max": 10000,
           "min": 0.02,
           "fixedFee": 0.35,
           "variableFee": 1.9,
           "connections": [
             {
               "id": "765228ec-afb0-4465-b471-83e8521a4ef3",
               "name": "Paypal main",
               "merchantCoversFee": true,
               "shippingAddressAllowed": true,
               "shippingAddressEquality": false
             },
             {
               "id": "aaa794cc-6dbd-4087-aaed-fc37817cb919",
               "name": "Paypal extra",
               "merchantCoversFee": false,
               "shippingAddressAllowed": true,
               "shippingAddressEquality": true
             }
           ]
         }
       ]
    }
    """
    Then I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "post",
        "url": "https://communications-third-party.test.devpayever.com/api/business/012c165f-8b88-405f-99e2-82f74339a757/connection/0a6e4af8-c75a-4196-9712-c9dddf540d3d/action/send-message",
        "body": "{\"from\":\"+421234567\",\"message\":\"Test message\",\"to\":\"+421234567\"}"
      },
      "response": {
        "status": 200,
        "body": {
          "accessToken": "{{guestToken}}"
        }
      }
    }
    """
    Then I send a POST request to "/api/flow/v1/{{flowId}}/send-to-device" with json:
    """
    {
      "email": "test@test.com",
      "subject": "Test subject",
      "phoneFrom": "+421234567",
      "phoneTo": "+421234567",
      "message": "Test message"
    }
    """
    And the response status code should be 200
    Then print RabbitMQ exchange "async_events" message list
    And RabbitMQ exchange "async_events" should contain following messages:
    """
    [
     {
       "name": "checkout.event.api-call.created",
       "payload": {
         "id": "*",
         "businessId": "012c165f-8b88-405f-99e2-82f74339a757",
         "channel": "magento",
         "channelSetId": "006388b0-e536-4d71-b1f1-c21a6f1801e6",
         "currency": "EUR",
         "fee": 0,
         "downPayment": 0,
         "cancelUrl": "https://callback.com/canceled/--CALL-ID--",
         "createdAt": "*",
         "updatedAt": "*"
       }
     },
     {
       "name": "payever.event.mailer.send",
       "payload": {
         "html": "Test message",
         "subject": "Test subject",
         "to": "test@test.com"
       }
     }
    ]
    """
    Then I am not authenticated
    Then I authenticate as a user with the following data:
    """
    {
      "email": "email@test.com",
      "roles": [
        {
          "name": "merchant",
          "permissions": [
            {
              "businessId": "12345",
              "acls": []
            }
          ]
        }
      ],
      "tokenId": "{{registeredTokenId}}"
    }
    """
    Then I send a POST request to "/api/flow/v1/{{flowId}}/clone" with json:
    """
    { }
    """
    And the response status code should be 403
    Then I am not authenticated
    Then I authenticate as a user with the following data:
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
    Then I send a POST request to "/api/flow/v1/{{flowId}}/clone" with json:
    """
    { }
    """
    And the response status code should be 201
    Then I get "id" from response and remember as "clonedFlowId"
    And the response should contain json:
    """
    {
       "id": "{{clonedFlowId}}",
       "amount": 200,
       "downPayment": 10,
       "currency": "EUR",
       "reference": "test_ref",
       "total": 250,
       "cart": [],
       "deliveryFee": 50,
       "posMerchantMode": false,
       "forceLegacyCartStep": true,
       "forceLegacyUseInventory": true,
       "state": "IN_PROGRESS",
       "businessId": "*",
       "businessName": "Test business",
       "businessCountry": "DE",
       "channel": "magento",
       "channelSetId": "{{channelSetId}}",
       "checkoutId": "*",
       "connectionId": "765228ec-afb0-4465-b471-83e8521a4ef3",
       "paymentOptions": [
         {
           "name": "paypal.name",
           "paymentMethod": "paypal",
           "max": 10000,
           "min": 0.02,
           "fixedFee": 0.35,
           "variableFee": 1.9,
           "connections": [
             {
               "id": "765228ec-afb0-4465-b471-83e8521a4ef3",
               "name": "Paypal main",
               "merchantCoversFee": true,
               "shippingAddressAllowed": true,
               "shippingAddressEquality": false
             },
             {
               "id": "aaa794cc-6dbd-4087-aaed-fc37817cb919",
               "name": "Paypal extra",
               "merchantCoversFee": false,
               "shippingAddressAllowed": true,
               "shippingAddressEquality": true
             }
           ]
         }
       ]
    }
    """
    Then I send a GET request to "/api/flow/v1/{{clonedFlowId}}"
    And the response status code should be 200
    Then I am not authenticated
    Then I authenticate as a user with the following data:
    """
    {
      "email": "email@test.com",
      "roles": [
        {
          "name": "merchant",
          "permissions": [
            {
              "businessId": "{{businessId}}",
              "acls": []
            }
          ]
        }
      ],
      "tokenId": "{{registeredTokenId}}"
    }
    """
    And I send a GET request to "/api/flow/v1/{{flowId}}"
    And the response status code should be 403
    Then I am not authenticated
    Then I authenticate as a user with the following data:
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
    And I send a PATCH request to "/api/flow/v1/{{flowId}}/authorization" with json:
    """
    {
      "token": "{{registeredToken}}"
    }
    """
    Then print last response
    And the response status code should be 200
    Then I am not authenticated
    Then I authenticate as a user with the following data:
    """
    {
      "email": "email@test.com",
      "roles": [
        {
          "name": "merchant",
          "permissions": [
            {
              "businessId": "{{businessId}}",
              "acls": []
            }
          ]
        }
      ],
      "tokenId": "{{registeredTokenId}}"
    }
    """
    And I send a GET request to "/api/flow/v1/{{flowId}}"
    And the response status code should be 200

  Scenario: Clone flow by BC flowId
    Given I use DB fixture "flow/flow/v1/integrations"
    And I use DB fixture "flow/flow/v1/businesses"
    And I use DB fixture "flow/flow/v1/business-integration-subs"
    And I use DB fixture "flow/flow/v1/checkouts"
    And I use DB fixture "flow/flow/v1/checkout-integration-subs"
    And I use DB fixture "flow/flow/v1/channel-sets"
    And I use DB fixture "flow/flow/v1/connections"
    And I use DB fixture "flow/flow/v1/flow"
    And I remember as "flowId" following value:
      """
      "f83e581c-4e99-4f66-adb5-0f6dd5230579"
      """
    Then I authenticate as a user with the following data:
    """
    {
      "email": "email@test.com",
      "roles": [
        {
          "name": "merchant",
          "permissions": [
            {
              "businessId": "{{businessId}}",
              "acls": []
            }
          ]
        }
      ],
      "tokenId": "{{tokenId}}"
    }
    """
    Then I send a POST request to "/api/flow/v1/{{flowId}}/clone" with json:
    """
    { }
    """
    Then print last response
    And the response status code should be 201
    Then I get "id" from response and remember as "clonedFlowId"
    And the response should contain json:
    """
    {
       "id": "{{clonedFlowId}}",
       "amount": 100,
       "currency": "EUR",
       "reference": "test_ref",
       "total": 100,
       "cart": [],
       "deliveryFee": 0,
       "posMerchantMode": false,
       "forceLegacyCartStep": false,
       "forceLegacyUseInventory": false,
       "state": "IN_PROGRESS",
       "businessId": "012c165f-8b88-405f-99e2-82f74339a757",
       "businessName": "Test business",
       "businessCountry": "DE",
       "channelSetId": "006388b0-e536-4d71-b1f1-c21a6f1801e6",
       "paymentOptions": [
         {
           "name": "paypal.name",
           "paymentMethod": "paypal",
           "max": 10000,
           "min": 0.02,
           "fixedFee": 0.35,
           "variableFee": 1.9,
           "connections": [
             {
               "id": "765228ec-afb0-4465-b471-83e8521a4ef3",
               "name": "Paypal main",
               "merchantCoversFee": true,
               "shippingAddressAllowed": true,
               "shippingAddressEquality": false
             },
             {
               "id": "aaa794cc-6dbd-4087-aaed-fc37817cb919",
               "name": "Paypal extra",
               "merchantCoversFee": false,
               "shippingAddressAllowed": true,
               "shippingAddressEquality": true
             }
           ]
         }
       ]
    }
    """

  Scenario: Get flow with disabled validation and wrong amount, payment options should be still in place
    Given I use DB fixture "flow/flow/v1/integrations"
    And I use DB fixture "flow/flow/v1/businesses"
    And I use DB fixture "flow/flow/v1/business-integration-subs"
    And I use DB fixture "flow/flow/v1/checkouts"
    And I use DB fixture "flow/flow/v1/checkout-integration-subs"
    And I use DB fixture "flow/flow/v1/channel-sets"
    And I use DB fixture "flow/flow/v1/connections"
    And I use DB fixture "flow/flow/v1/flow-disable-validation-amount"
    And I remember as "flowId" following value:
      """
      "f83e581c-4e99-4f66-adb5-0f6dd5230579"
      """
    Then I authenticate as a user with the following data:
    """
    {
      "email": "email@test.com",
      "roles": [
        {
          "name": "admin",
          "permissions": [
            {
              "businessId": "{{businessId}}",
              "acls": []
            }
          ]
        }
      ],
      "tokenId": "{{tokenId}}"
    }
    """
    Then I send a GET request to "/api/flow/v1/{{flowId}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    {
       "id": "{{flowId}}",
       "amount": 1,
       "currency": "EUR",
       "reference": "test_ref",
       "total": 1,
       "billingAddress": {
         "city": "Hamburg",
         "country": "DE",
         "firstName": "Test",
         "lastName": "Test",
         "street": "Test 12",
         "zipCode": "12345"
       },
       "cart": [],
       "deliveryFee": 0,
       "posMerchantMode": false,
       "forceLegacyCartStep": false,
       "forceLegacyUseInventory": false,
       "state": "IN_PROGRESS",
       "businessId": "012c165f-8b88-405f-99e2-82f74339a757",
       "businessName": "Test business",
       "businessCountry": "DE",
       "channelSetId": "006388b0-e536-4d71-b1f1-c21a6f1801e6",
       "paymentOptions": [
         {
           "name": "paypal.name",
           "paymentMethod": "paypal",
           "max": 10000,
           "min": 0.02,
           "fixedFee": 0.35,
           "variableFee": 1.9,
           "shareBagEnabled": true,
           "connections": [
             {
               "id": "765228ec-afb0-4465-b471-83e8521a4ef3",
               "default": false,
               "name": "Paypal main",
               "merchantCoversFee": true,
               "min": 0.02,
               "max": 10000,
               "shippingAddressAllowed": true,
               "shippingAddressEquality": false,
               "version": "default"
             },
             {
               "id": "aaa794cc-6dbd-4087-aaed-fc37817cb919",
               "default": false,
               "name": "Paypal extra",
               "merchantCoversFee": false,
               "min": 0.02,
               "max": 10000,
               "shippingAddressAllowed": true,
               "shippingAddressEquality": true,
               "version": "default"
             }
           ]
         },
         {
           "name": "santander_installment.name",
           "paymentMethod": "santander_installment",
           "max": 100000,
           "min": 99,
           "fixedFee": 0,
           "variableFee": 0,
           "shareBagEnabled": false,
           "connections": [
             {
               "id": "2dd4d7e2-3e6d-44fc-a78b-7acfa2977794",
               "default": false,
               "name": "Santander DE",
               "merchantCoversFee": false,
               "min": 99,
               "max": 100000,
               "shippingAddressAllowed": false,
               "shippingAddressEquality": false,
               "version": "default"
             }
           ]
         }
       ]
    }
    """

  Scenario: Get flow with disabled validation and wrong currency, payment options should be still in place
    Given I use DB fixture "flow/flow/v1/integrations"
    And I use DB fixture "flow/flow/v1/businesses"
    And I use DB fixture "flow/flow/v1/business-integration-subs"
    And I use DB fixture "flow/flow/v1/checkouts"
    And I use DB fixture "flow/flow/v1/checkout-integration-subs"
    And I use DB fixture "flow/flow/v1/channel-sets"
    And I use DB fixture "flow/flow/v1/connections"
    And I use DB fixture "flow/flow/v1/flow-disable-validation-currency"
    And I remember as "flowId" following value:
      """
      "f83e581c-4e99-4f66-adb5-0f6dd5230579"
      """
    Then I authenticate as a user with the following data:
    """
    {
      "email": "email@test.com",
      "roles": [
        {
          "name": "admin",
          "permissions": [
            {
              "businessId": "{{businessId}}",
              "acls": []
            }
          ]
        }
      ],
      "tokenId": "{{tokenId}}"
    }
    """
    Then I send a GET request to "/api/flow/v1/{{flowId}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    {
       "id": "{{flowId}}",
       "amount": 200,
       "currency": "DKK",
       "reference": "test_ref",
       "total": 200,
       "billingAddress": {
         "city": "Hamburg",
         "country": "DE",
         "firstName": "Test",
         "lastName": "Test",
         "street": "Test 12",
         "zipCode": "12345"
       },
       "cart": [],
       "deliveryFee": 0,
       "posMerchantMode": false,
       "forceLegacyCartStep": false,
       "forceLegacyUseInventory": false,
       "state": "IN_PROGRESS",
       "businessId": "012c165f-8b88-405f-99e2-82f74339a757",
       "businessName": "Test business",
       "businessCountry": "DE",
       "channelSetId": "006388b0-e536-4d71-b1f1-c21a6f1801e6",
       "paymentOptions": [
         {
           "name": "paypal.name",
           "paymentMethod": "paypal",
           "max": 10000,
           "min": 0.1,
           "fixedFee": 0.35,
           "variableFee": 1.9,
           "shareBagEnabled": true,
           "connections": [
             {
               "id": "765228ec-afb0-4465-b471-83e8521a4ef3",
               "default": false,
               "name": "Paypal main",
               "merchantCoversFee": true,
               "min": 0.1,
               "max": 10000,
               "shippingAddressAllowed": true,
               "shippingAddressEquality": false,
               "version": "default"
             },
             {
               "id": "aaa794cc-6dbd-4087-aaed-fc37817cb919",
               "default": false,
               "name": "Paypal extra",
               "merchantCoversFee": false,
               "min": 0.1,
               "max": 10000,
               "shippingAddressAllowed": true,
               "shippingAddressEquality": true,
               "version": "default"
             }
           ]
         },
         {
           "name": "santander_installment.name",
           "paymentMethod": "santander_installment",
           "max": 100000,
           "min": 99,
           "fixedFee": 0,
           "variableFee": 0,
           "shareBagEnabled": false,
           "connections": [
             {
               "id": "2dd4d7e2-3e6d-44fc-a78b-7acfa2977794",
               "default": false,
               "name": "Santander DE",
               "merchantCoversFee": false,
               "min": 99,
               "max": 100000,
               "shippingAddressAllowed": false,
               "shippingAddressEquality": false,
               "version": "default"
             }
           ]
         }
       ]
    }
    """

  Scenario: Get flow with disabled validation and wrong country, payment options should be still in place
    Given I use DB fixture "flow/flow/v1/integrations"
    And I use DB fixture "flow/flow/v1/businesses"
    And I use DB fixture "flow/flow/v1/business-integration-subs"
    And I use DB fixture "flow/flow/v1/checkouts"
    And I use DB fixture "flow/flow/v1/checkout-integration-subs"
    And I use DB fixture "flow/flow/v1/channel-sets"
    And I use DB fixture "flow/flow/v1/connections"
    And I use DB fixture "flow/flow/v1/flow-disable-validation-country"
    And I remember as "flowId" following value:
      """
      "f83e581c-4e99-4f66-adb5-0f6dd5230579"
      """
    Then I authenticate as a user with the following data:
    """
    {
      "email": "email@test.com",
      "roles": [
        {
          "name": "admin",
          "permissions": [
            {
              "businessId": "{{businessId}}",
              "acls": []
            }
          ]
        }
      ],
      "tokenId": "{{tokenId}}"
    }
    """
    Then I send a GET request to "/api/flow/v1/{{flowId}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    {
       "id": "{{flowId}}",
       "amount": 200,
       "currency": "EUR",
       "reference": "test_ref",
       "total": 200,
       "billingAddress": {
         "city": "Hamburg",
         "country": "DK",
         "firstName": "Test",
         "lastName": "Test",
         "street": "Test 12",
         "zipCode": "12345"
       },
       "cart": [],
       "deliveryFee": 0,
       "posMerchantMode": false,
       "forceLegacyCartStep": false,
       "forceLegacyUseInventory": false,
       "state": "IN_PROGRESS",
       "businessId": "012c165f-8b88-405f-99e2-82f74339a757",
       "businessName": "Test business",
       "businessCountry": "DE",
       "channelSetId": "006388b0-e536-4d71-b1f1-c21a6f1801e6",
       "paymentOptions": [
         {
           "name": "paypal.name",
           "paymentMethod": "paypal",
           "max": 10000,
           "min": 0.02,
           "fixedFee": 0.35,
           "variableFee": 1.9,
           "shareBagEnabled": true,
           "connections": [
             {
               "id": "765228ec-afb0-4465-b471-83e8521a4ef3",
               "default": false,
               "name": "Paypal main",
               "merchantCoversFee": true,
               "min": 0.02,
               "max": 10000,
               "shippingAddressAllowed": true,
               "shippingAddressEquality": false,
               "version": "default"
             },
             {
               "id": "aaa794cc-6dbd-4087-aaed-fc37817cb919",
               "default": false,
               "name": "Paypal extra",
               "merchantCoversFee": false,
               "min": 0.02,
               "max": 10000,
               "shippingAddressAllowed": true,
               "shippingAddressEquality": true,
               "version": "default"
             }
           ]
         },
         {
           "name": "santander_installment.name",
           "paymentMethod": "santander_installment",
           "max": 100000,
           "min": 99,
           "fixedFee": 0,
           "variableFee": 0,
           "shareBagEnabled": false,
           "connections": [
             {
               "id": "2dd4d7e2-3e6d-44fc-a78b-7acfa2977794",
               "default": false,
               "name": "Santander DE",
               "merchantCoversFee": false,
               "min": 99,
               "max": 100000,
               "shippingAddressAllowed": false,
               "shippingAddressEquality": false,
               "version": "default"
             }
           ]
         }
       ]
    }
    """

  Scenario: Redirect on call callback urls
    And I remember as "flowId" following value:
      """
      "9759055c-549a-4c0f-a840-8ff96aae0e25"
      """
    And I use DB fixture "flow/flow/v1/flow"
    And I use DB fixture "flow/flow/v1/api-call"
    Then I send a GET request to "/api/flow/v1/{{flowId}}/callback/success"
    Then print last response
    And the response status code should be 301
    And the response header "location" should have value "https://payever.de/success/api-call-id/b5965f9d-5971-4b02-90eb-537a0a6e07c7/payment-id/2de6d4c1-5aa0-40a3-bf3c-0fc9d215aa73"
    Then I look for model "Flow" with id "{{flowId}}" and remember as "flow"
    Then print storage key "flow"
    Then stored value "flow" should contain json:
    """
      {
        "_id": "{{flowId}}",
        "callbackTriggeredAt": "*",
        "callbackType": "success"
      }
    """
    Then I send a GET request to "/api/flow/v1/{{flowId}}/callback/success"
    Then print last response
    And the response status code should be 412
    And the response should contain json:
    """
    {
      "statusCode": 412,
      "message": "Callback was already called",
      "error": "Precondition Failed"
    }
    """

  Scenario: Start flow with callback urls
    Given I use DB fixture "flow/flow/v1/integrations"
    And I use DB fixture "flow/flow/v1/businesses"
    And I use DB fixture "flow/flow/v1/business-integration-subs"
    And I use DB fixture "flow/flow/v1/checkouts"
    And I use DB fixture "flow/flow/v1/checkout-integration-subs"
    And I use DB fixture "flow/flow/v1/channel-sets"
    And I use DB fixture "flow/flow/v1/connections"
    And I mock an axios request with parameters:
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
    When I send a POST request to "/api/flow/v1" with json:
    """
    {
      "channelSetId": "{{channelSetId}}",
      "noticeUrl": "http://notice.url",
      "cancelUrl": "http://cancel.url",
      "customerRedirectUrl": "http://customer-redirect.url",
      "failureUrl": "http://failure.url",
      "pendingUrl": "http://pending.url",
      "successUrl": "http://success.url"
    }
    """
    And the response status code should be 201
    Then I get "apiCall.id" from response and remember as "apiCallId"
    And print last response
    Then print RabbitMQ exchange "async_events" message list
    And the RabbitMQ exchange "async_events" should contain following messages:
    """
    [
      {
         "name": "checkout.event.api-call.created",
         "payload": {
           "id": "*",
           "businessId": "012c165f-8b88-405f-99e2-82f74339a757",
           "channel": "magento",
           "channelSetId": "006388b0-e536-4d71-b1f1-c21a6f1801e6",
           "currency": "EUR",
           "fee": 0,
           "downPayment": 0,
           "noticeUrl": "http://notice.url",
           "cancelUrl": "http://cancel.url",
           "customerRedirectUrl": "http://customer-redirect.url",
           "failureUrl": "http://failure.url",
           "pendingUrl": "http://pending.url",
           "successUrl": "http://success.url",
           "createdAt": "*",
           "updatedAt": "*"
         }
       },
       {
         "name": "checkout.event.payment-flow.created",
         "payload": {
           "flow": {
             "id": "*",
             "amount": 0,
             "api_call_create_id": "*",
             "business_id": "012c165f-8b88-405f-99e2-82f74339a757",
             "channel_set_uuid": "006388b0-e536-4d71-b1f1-c21a6f1801e6",
             "currency": "EUR",
             "shipping_fee": 0,
             "state": "IN_PROGRESS"
           }
         }
       }
    ]
    """
