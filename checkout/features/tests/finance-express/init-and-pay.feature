Feature: Finance express init and pay
  Scenario: Init finance express payment and pay
    Given I use DB fixture "connection/checkout-connection/finance-express/apple-pay"
    Given I use DB fixture "finance-express/channel-sets"
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
    And I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "post",
        "url": "*/api/connection/4ca57652-6881-4b54-9c11-ce00c79fcb45/action/payment-pre-initialize",
        "body": "{\"amount\":500,\"deliveryFee\":0}"
      },
      "response": {
        "status": 200,
        "body": {
          "publishKey": "test_publish_key"
        }
      }
    }
    """
    When I send a POST request to "/api/finance-express/apple_pay/init" with json:
    """
    {
        "initData": {
            "amount": 500,
            "deliveryFee": 0
        },
        "flow": {
            "channelSetId": "006388b0-e536-4d71-b1f1-c21a6f1801e6"
        }
    }
    """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
    """
    {
      "flow": {
        "country": "DE",
        "currency": "EUR"
      },
      "initData": {
        "publishKey": "test_publish_key"
      }
    }
    """
    Then I send a POST request to "/api/flow/v1" with json:
    """
    {
      "channelSetId": "006388b0-e536-4d71-b1f1-c21a6f1801e6"
    }
    """
    Then I get "id" from response and remember as "flowId"
    Then I send a POST request to "/api/finance-express/apple_pay/pay" with json:
    """
    {
      "payment": {
        "amount": 500,
        "address": {
          "city": "Wasserbad",
          "country": "DE",
          "firstName": "test",
          "lastName": "test",
          "street": "Sonnentalweg 18",
          "streetNumber": "18",
          "salutation": "SALUTATION_MR",
          "zipCode": "73888",
          "email": "m.kunze@wasserbadmail.de",
          "phone": "4212345678"
        },
        "businessId": "cf90cc45-9aa2-4181-b426-007b1ca58cf0",
        "businessName": "DE_2",
        "channel": "api",
        "channelSetId": "006388b0-e536-4d71-b1f1-c21a6f1801e6",
        "currency": "EUR",
        "customerEmail": "m.kunze@wasserbadmail.de",
        "customerName": "Grün Ampel",
        "reference": "12d5d8th56rt4sd6sd",
        "deliveryFee": 0,
        "total": 500,
        "flowId": "{{flowId}}"
      },
      "paymentDetails": {

      },
      "paymentItems": [
        {
          "name": "TEST-GRUEN",
          "price": 500,
          "quantity": 1,
          "identifier": "12345"
        }
      ]
    }
    """
    Then print last response
    Then the response status code should be 403
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
    And I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "post",
        "url": "*/api/connection/4ca57652-6881-4b54-9c11-ce00c79fcb45/action/pay",
        "body": "{\"payment\":{\"amount\":500,\"address\":{\"city\":\"Wasserbad\",\"country\":\"DE\",\"firstName\":\"test\",\"lastName\":\"test\",\"street\":\"Sonnentalweg 18\",\"streetNumber\":\"18\",\"salutation\":\"SALUTATION_MR\",\"zipCode\":\"73888\",\"email\":\"m.kunze@wasserbadmail.de\",\"phone\":\"4212345678\"},\"businessId\":\"*\",\"businessName\":\"*\",\"channel\":\"api\",\"channelSetId\":\"006388b0-e536-4d71-b1f1-c21a6f1801e6\",\"currency\":\"EUR\",\"customerEmail\":\"m.kunze@wasserbadmail.de\",\"customerName\":\"Grün Ampel\",\"reference\":\"12d5d8th56rt4sd6sd\",\"deliveryFee\":0,\"total\":500,\"flowId\":\"{{flowId}}\"},\"paymentDetails\":{},\"paymentItems\":[{\"name\":\"TEST-GRUEN\",\"price\":500,\"quantity\":1,\"identifier\":\"12345\"}]}"
      },
      "response": {
        "status": 200,
        "body":
          {
            "id": "12345",
            "payment": {
              "downPayment": 0,
              "paymentFee": 0,
              "deliveryFee": 0,
              "amount": 500,
              "address": {
                "city": "Wasserbad",
                "country": "DE",
                "email": "test@test.com",
                "firstName": "First name",
                "lastName": "Last name",
                "phone": "+49837455",
                "salutation": "MR",
                "street": "street 2",
                "zipCode": "1234"
              },
              "businessId": "b197bf22-6309-11e7-a2a8-5254008319f0",
              "businessName": "business-1",
              "channel": "api",
              "channelSetId": "006388b0-e536-4d71-b1f1-c21a6f1801e6",
              "currency": "EUR",
              "customerEmail": "test@test.com",
              "customerName": "Test",
              "paymentType": "apple_pay",
              "reference": "qwerty",
              "status": "STATUS_NEW",
              "total": 500
            },
            "paymentDetails": {
             "chargeId": "intent_id",
             "clientSecret": "client_secret"
            },
            "paymentItems": [
              {
                "identifier": "1234567890",
                "name": "product-1",
                "price": 500,
                "quantity": 1,
                "sku": "111222",
                "productId": "b3e2f1af-004d-4f7f-ab15-1431de034356",
                "options": {
                  "color": "red",
                  "storage": "64GB"
                }
              }
            ],
            "options": {
              "merchantCoversFee": true,
              "shopRedirectEnabled": true
            }
          }
        }
      }
    """
    And I send a POST request to "/api/finance-express/apple_pay/pay" with json:
    """
    {
      "payment": {
        "amount": 500,
        "address": {
          "city": "Wasserbad",
          "country": "DE",
          "firstName": "test",
          "lastName": "test",
          "street": "Sonnentalweg 18",
          "streetNumber": "18",
          "salutation": "SALUTATION_MR",
          "zipCode": "73888",
          "email": "m.kunze@wasserbadmail.de",
          "phone": "4212345678"
        },
        "businessId": "cf90cc45-9aa2-4181-b426-007b1ca58cf0",
        "businessName": "DE_2",
        "channel": "api",
        "channelSetId": "006388b0-e536-4d71-b1f1-c21a6f1801e6",
        "currency": "EUR",
        "customerEmail": "m.kunze@wasserbadmail.de",
        "customerName": "Grün Ampel",
        "reference": "12d5d8th56rt4sd6sd",
        "deliveryFee": 0,
        "total": 500,
        "flowId": "{{flowId}}"
      },
      "paymentDetails": {

      },
      "paymentItems": [
        {
          "name": "TEST-GRUEN",
          "price": 500,
          "quantity": 1,
          "identifier": "12345"
        }
      ]
    }
    """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
    """
    {
       "id": "12345",
       "payment": {
         "downPayment": 0,
         "paymentFee": 0,
         "deliveryFee": 0,
         "amount": 500,
         "address": {
           "city": "Wasserbad",
           "country": "DE",
           "email": "test@test.com",
           "firstName": "First name",
           "lastName": "Last name",
           "phone": "+49837455",
           "salutation": "MR",
           "street": "street 2",
           "zipCode": "1234"
         },
         "businessId": "b197bf22-6309-11e7-a2a8-5254008319f0",
         "businessName": "business-1",
         "channel": "api",
         "channelSetId": "006388b0-e536-4d71-b1f1-c21a6f1801e6",
         "currency": "EUR",
         "customerEmail": "test@test.com",
         "customerName": "Test",
         "paymentType": "apple_pay",
         "reference": "qwerty",
         "status": "STATUS_NEW",
         "total": 500
       },
       "paymentDetails": {
         "chargeId": "intent_id",
         "clientSecret": "client_secret"
       },
       "paymentItems": [
         {
           "identifier": "1234567890",
           "name": "product-1",
           "price": 500,
           "quantity": 1,
           "sku": "111222",
           "productId": "b3e2f1af-004d-4f7f-ab15-1431de034356",
           "options": {
             "color": "red",
             "storage": "64GB"
           }
         }
       ],
       "options": {
         "merchantCoversFee": true,
         "shopRedirectEnabled": true
       }
     }
    """
