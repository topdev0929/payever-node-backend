Feature: Transaction data
  Scenario: Get transaction data by payment id
    Given I remember as "paymentId" following value:
      """
      "9a8521e181fa3de1127141aa3653b622"
      """
    Given I authenticate as a user with the following data:
    """
    {
      "id": "2673fa45-82b9-484c-bcbe-46da250c2639",
      "email": "testcases@payever.de",
      "firstName": "Test",
      "lastName": "Test",
      "roles": [
        {
          "name": "admin"
        }
      ]
    }
    """
    And I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "post",
        "url": "*/api/connection/765228ec-afb0-4465-b471-83e8521a4ef3/action/transaction-data",
        "body": "{\"paymentId\":\"{{paymentId}}\"}"
      },
      "response": {
        "status": 201,
        "body": {
          "id": "{{paymentId}}",
          "createdAt": "2024-01-18T15:26:35.425Z",
          "payment": {
              "deliveryFee": 0,
              "paymentFee": 0,
              "amount": 999.99,
              "address": {
                  "city": "Wasserbad",
                  "country": "DE",
                  "email": "m.rkuznze@w3asserrbadmail.de",
                  "firstName": "Stub",
                  "lastName": "Accepted",
                  "phone": "4212345678",
                  "salutation": "SALUTATION_MR",
                  "street": "Sonnentalweg 19",
                  "streetNumber": "19",
                  "zipCode": "73888"
              },
              "businessId": "3a7ce964-4cda-4ca0-8719-e934fb58a5f1",
              "businessName": "Test",
              "channel": "api",
              "channelSetId": "123",
              "currency": "EUR",
              "customerEmail": "m.kunze@wasserbadmail.de",
              "customerName": "Ampel Grün",
              "downPayment": 0,
              "flowId": "oweeeijewf",
              "paymentType": "santander_invoice_de",
              "reference": "12d5d8th5eze62ret4sd46swd",
              "specificStatus": "ACCEPTED",
              "status": "STATUS_ACCEPTED",
              "total": 999.99
          },
          "paymentDetails": {
              "advertisingAccepted": true,
              "birthday": "1997-02-01T09:34:08.700Z",
              "conditionsAccepted": true,
              "finalizeUniqueId": null,
              "receiptUniqueId": null,
              "reservationUniqueId": "stub_unique_id",
              "riskSessionId": "",
              "usageText": "stub_usage_text",
              "posVerifyType": null,
              "posMerchantMode": null,
              "shopUserSession": "98asdwa56e48asd3548eweqdq4d",
              "totalPaidAmount": null,
              "errorCode": null
          },
          "paymentItems": [
              {
                  "identifier": "Product1",
                  "name": "Product 1",
                  "price": 925.92,
                  "quantity": 1
              },
              {
                  "identifier": "Product2",
                  "name": "Product 2",
                  "price": 74.07,
                  "quantity": 1
              }
          ],
          "options": {
              "merchantCoversFee": false,
              "shopRedirectEnabled": false,
              "isEmailNotificationAllowed": null,
              "isAutoCaptureEnabled": false,
              "captureType": "CAPTURE_ON_FULFILLMENT",
              "ratesLimits": [],
              "ratesDefaultTerm": null,
              "countryLimits": [],
              "validateActionAmount": null
          },
          "paymentHistory": [
              {
                  "action": "preauthorize",
                  "amount": 999.99,
                  "paymentItems": [],
                  "paymentStatus": "STATUS_NEW",
                  "pspStatus": null,
                  "createdAt": "2024-01-18T15:26:35.477Z"
              },
              {
                  "action": "status_changed",
                  "amount": 999.99,
                  "paymentItems": [],
                  "paymentStatus": "STATUS_ACCEPTED",
                  "pspStatus": "ACCEPTED",
                  "extraData": {
                      "payment_status": "STATUS_ACCEPTED"
                  },
                  "createdAt": "2024-01-18T15:26:35.506Z"
              }
          ]
        }
      }
    }
    """
    And I use DB fixture "legacy-api/payments"
    And I use DB fixture "legacy-api/businesses"
    And I use DB fixture "legacy-api/integrations"
    And I use DB fixture "legacy-api/connections"
    When I send a GET request to "/api/transaction-data/{{paymentId}}"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "id": "{{paymentId}}",
      "createdAt": "2024-01-18T15:26:35.425Z",
      "payment": {
          "deliveryFee": 0,
          "paymentFee": 0,
          "amount": 999.99,
          "address": {
              "city": "Wasserbad",
              "country": "DE",
              "email": "m.rkuznze@w3asserrbadmail.de",
              "firstName": "Stub",
              "lastName": "Accepted",
              "phone": "4212345678",
              "salutation": "SALUTATION_MR",
              "street": "Sonnentalweg 19",
              "streetNumber": "19",
              "zipCode": "73888"
          },
          "businessId": "3a7ce964-4cda-4ca0-8719-e934fb58a5f1",
          "businessName": "Test",
          "channel": "api",
          "channelSetId": "123",
          "currency": "EUR",
          "customerEmail": "m.kunze@wasserbadmail.de",
          "customerName": "Ampel Grün",
          "downPayment": 0,
          "flowId": "oweeeijewf",
          "paymentType": "santander_invoice_de",
          "reference": "12d5d8th5eze62ret4sd46swd",
          "specificStatus": "ACCEPTED",
          "status": "STATUS_ACCEPTED",
          "total": 999.99
      },
      "paymentDetails": {
          "advertisingAccepted": true,
          "birthday": "1997-02-01T09:34:08.700Z",
          "conditionsAccepted": true,
          "finalizeUniqueId": null,
          "receiptUniqueId": null,
          "reservationUniqueId": "stub_unique_id",
          "riskSessionId": "",
          "usageText": "stub_usage_text",
          "posVerifyType": null,
          "posMerchantMode": null,
          "shopUserSession": "98asdwa56e48asd3548eweqdq4d",
          "totalPaidAmount": null,
          "errorCode": null
      },
      "paymentItems": [
          {
              "identifier": "Product1",
              "name": "Product 1",
              "price": 925.92,
              "quantity": 1
          },
          {
              "identifier": "Product2",
              "name": "Product 2",
              "price": 74.07,
              "quantity": 1
          }
      ],
      "options": {
          "merchantCoversFee": false,
          "shopRedirectEnabled": false,
          "isEmailNotificationAllowed": null,
          "isAutoCaptureEnabled": false,
          "captureType": "CAPTURE_ON_FULFILLMENT",
          "ratesLimits": [],
          "ratesDefaultTerm": null,
          "countryLimits": [],
          "validateActionAmount": null
      },
      "paymentHistory": [
          {
              "action": "preauthorize",
              "amount": 999.99,
              "paymentItems": [],
              "paymentStatus": "STATUS_NEW",
              "pspStatus": null,
              "createdAt": "2024-01-18T15:26:35.477Z"
          },
          {
              "action": "status_changed",
              "amount": 999.99,
              "paymentItems": [],
              "paymentStatus": "STATUS_ACCEPTED",
              "pspStatus": "ACCEPTED",
              "extraData": {
                  "payment_status": "STATUS_ACCEPTED"
              },
              "createdAt": "2024-01-18T15:26:35.506Z"
          }
      ]
    }
    """

  Scenario: Get transaction data by business id
    Given I remember as "businessId" following value:
      """
      "012c165f-8b88-405f-99e2-82f74339a757"
      """
    Given I authenticate as a user with the following data:
    """
    {
      "id": "2673fa45-82b9-484c-bcbe-46da250c2639",
      "email": "testcases@payever.de",
      "firstName": "Test",
      "lastName": "Test",
      "roles": [
        {
          "name": "admin"
        }
      ]
    }
    """
    And I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "post",
        "url": "*/api/connection/765228ec-afb0-4465-b471-83e8521a4ef3/action/business-transaction-data",
        "body": "{\"startDate\":null,\"endDate\":null,\"businessId\":\"{{businessId}}\",\"paymentMethod\":\"paypal\"}"
      },
      "response": {
        "status": 201,
        "body": [{
          "id": "{{paymentId}}",
          "createdAt": "2024-01-18T15:26:35.425Z",
          "payment": {
              "deliveryFee": 0,
              "paymentFee": 0,
              "amount": 999.99,
              "address": {
                  "city": "Wasserbad",
                  "country": "DE",
                  "email": "m.rkuznze@w3asserrbadmail.de",
                  "firstName": "Stub",
                  "lastName": "Accepted",
                  "phone": "4212345678",
                  "salutation": "SALUTATION_MR",
                  "street": "Sonnentalweg 19",
                  "streetNumber": "19",
                  "zipCode": "73888"
              },
              "businessId": "3a7ce964-4cda-4ca0-8719-e934fb58a5f1",
              "businessName": "Test",
              "channel": "api",
              "channelSetId": "123",
              "currency": "EUR",
              "customerEmail": "m.kunze@wasserbadmail.de",
              "customerName": "Ampel Grün",
              "downPayment": 0,
              "flowId": "oweeeijewf",
              "paymentType": "santander_invoice_de",
              "reference": "12d5d8th5eze62ret4sd46swd",
              "specificStatus": "ACCEPTED",
              "status": "STATUS_ACCEPTED",
              "total": 999.99
          },
          "paymentDetails": {
              "advertisingAccepted": true,
              "birthday": "1997-02-01T09:34:08.700Z",
              "conditionsAccepted": true,
              "finalizeUniqueId": null,
              "receiptUniqueId": null,
              "reservationUniqueId": "stub_unique_id",
              "riskSessionId": "",
              "usageText": "stub_usage_text",
              "posVerifyType": null,
              "posMerchantMode": null,
              "shopUserSession": "98asdwa56e48asd3548eweqdq4d",
              "totalPaidAmount": null,
              "errorCode": null
          },
          "paymentItems": [
              {
                  "identifier": "Product1",
                  "name": "Product 1",
                  "price": 925.92,
                  "quantity": 1
              },
              {
                  "identifier": "Product2",
                  "name": "Product 2",
                  "price": 74.07,
                  "quantity": 1
              }
          ],
          "options": {
              "merchantCoversFee": false,
              "shopRedirectEnabled": false,
              "isEmailNotificationAllowed": null,
              "isAutoCaptureEnabled": false,
              "captureType": "CAPTURE_ON_FULFILLMENT",
              "ratesLimits": [],
              "ratesDefaultTerm": null,
              "countryLimits": [],
              "validateActionAmount": null
          },
          "paymentHistory": [
              {
                  "action": "preauthorize",
                  "amount": 999.99,
                  "paymentItems": [],
                  "paymentStatus": "STATUS_NEW",
                  "pspStatus": null,
                  "createdAt": "2024-01-18T15:26:35.477Z"
              },
              {
                  "action": "status_changed",
                  "amount": 999.99,
                  "paymentItems": [],
                  "paymentStatus": "STATUS_ACCEPTED",
                  "pspStatus": "ACCEPTED",
                  "extraData": {
                      "payment_status": "STATUS_ACCEPTED"
                  },
                  "createdAt": "2024-01-18T15:26:35.506Z"
              }
          ]
        }]
      }
    }
    """
    And I use DB fixture "legacy-api/payments"
    And I use DB fixture "legacy-api/businesses"
    And I use DB fixture "legacy-api/integrations"
    And I use DB fixture "legacy-api/connections"
    When I send a GET request to "/api/transaction-data/paypal/business/{{businessId}}"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    [{
      "id": "{{paymentId}}",
      "createdAt": "2024-01-18T15:26:35.425Z",
      "payment": {
          "deliveryFee": 0,
          "paymentFee": 0,
          "amount": 999.99,
          "address": {
              "city": "Wasserbad",
              "country": "DE",
              "email": "m.rkuznze@w3asserrbadmail.de",
              "firstName": "Stub",
              "lastName": "Accepted",
              "phone": "4212345678",
              "salutation": "SALUTATION_MR",
              "street": "Sonnentalweg 19",
              "streetNumber": "19",
              "zipCode": "73888"
          },
          "businessId": "3a7ce964-4cda-4ca0-8719-e934fb58a5f1",
          "businessName": "Test",
          "channel": "api",
          "channelSetId": "123",
          "currency": "EUR",
          "customerEmail": "m.kunze@wasserbadmail.de",
          "customerName": "Ampel Grün",
          "downPayment": 0,
          "flowId": "oweeeijewf",
          "paymentType": "santander_invoice_de",
          "reference": "12d5d8th5eze62ret4sd46swd",
          "specificStatus": "ACCEPTED",
          "status": "STATUS_ACCEPTED",
          "total": 999.99
      },
      "paymentDetails": {
          "advertisingAccepted": true,
          "birthday": "1997-02-01T09:34:08.700Z",
          "conditionsAccepted": true,
          "finalizeUniqueId": null,
          "receiptUniqueId": null,
          "reservationUniqueId": "stub_unique_id",
          "riskSessionId": "",
          "usageText": "stub_usage_text",
          "posVerifyType": null,
          "posMerchantMode": null,
          "shopUserSession": "98asdwa56e48asd3548eweqdq4d",
          "totalPaidAmount": null,
          "errorCode": null
      },
      "paymentItems": [
          {
              "identifier": "Product1",
              "name": "Product 1",
              "price": 925.92,
              "quantity": 1
          },
          {
              "identifier": "Product2",
              "name": "Product 2",
              "price": 74.07,
              "quantity": 1
          }
      ],
      "options": {
          "merchantCoversFee": false,
          "shopRedirectEnabled": false,
          "isEmailNotificationAllowed": null,
          "isAutoCaptureEnabled": false,
          "captureType": "CAPTURE_ON_FULFILLMENT",
          "ratesLimits": [],
          "ratesDefaultTerm": null,
          "countryLimits": [],
          "validateActionAmount": null
      },
      "paymentHistory": [
          {
              "action": "preauthorize",
              "amount": 999.99,
              "paymentItems": [],
              "paymentStatus": "STATUS_NEW",
              "pspStatus": null,
              "createdAt": "2024-01-18T15:26:35.477Z"
          },
          {
              "action": "status_changed",
              "amount": 999.99,
              "paymentItems": [],
              "paymentStatus": "STATUS_ACCEPTED",
              "pspStatus": "ACCEPTED",
              "extraData": {
                  "payment_status": "STATUS_ACCEPTED"
              },
              "createdAt": "2024-01-18T15:26:35.506Z"
          }
      ]
    }]
    """
