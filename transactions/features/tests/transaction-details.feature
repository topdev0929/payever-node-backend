@business-transactions
Feature: Transaction details for business

  Background:
    Given I remember as "businessId" following value:
    """
    "36bf8981-8827-4c0c-a645-02d9fc6d72c8"
    """
    Given I remember as "transactionId" following value:
    """
    "ad738281-f9f0-4db7-a4f6-670b0dff5327"
    """

  Scenario Outline: No token provided
    Given I am not authenticated
    When I send a GET request to "<uri>"
    Then print last response
    And the response status code should be 403
    Examples:
      | uri                                                                                            |
      | /api/business/2382ffce-5620-4f13-885d-3c069f9dd9b4/detail/95a2904a-815c-4257-81b7-4df3934115f3 |
      | /api/admin/detail/95a2904a-815c-4257-81b7-4df3934115f3                                         |
      | /api/user/detail/95a2904a-815c-4257-81b7-4df3934115f3                                          |

  Scenario Outline: Insufficient token permissions
    Given I authenticate as a user with the following data:
      """
      <token>
      """
    When I send a GET request to "<uri>"
    Then print last response
    And the response status code should be 403
    Examples:
      | uri                                                                                            | token                                                                                                                     |
      | /api/business/2382ffce-5620-4f13-885d-3c069f9dd9b4/detail/95a2904a-815c-4257-81b7-4df3934115f3 | {"email": "email@email.com","roles": [{"name": "merchant","permissions": [{"businessId": "{{businessId}}","acls": []}]}]} |
      | /api/admin/detail/95a2904a-815c-4257-81b7-4df3934115f3                                         | {"email": "email@email.com","roles": [{"name": "merchant","permissions": [{"businessId": "{{businessId}}","acls": []}]}]} |

  Scenario Outline: Get transaction details
    Given I authenticate as a user with the following data:
      """
      <token>
      """
    And I use DB fixture "transactions/transaction-details"
    And I mock RPC request "payment_option.payex_creditcard.action" to "rpc_payment_payex" with:
      """
      {
        "requestPayload": {
          "action": "action.list"
        },
        "responsePayload": "s:80:\"{\"payload\":{\"status\":\"OK\",\"result\":{\"test_action\":true,\"another_action\":false}}}\";"
      }
      """
    When I send a GET request to "<uri>"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
         "actions": [],
         "transaction": {
           "original_id": "440ec879-7f02-48d4-9ffb-77adfaf79a06",
           "uuid": "ad738281-f9f0-4db7-a4f6-670b0dff5327",
           "amount": 50,
           "amount_cancel_rest": 50,
           "amount_canceled": 0,
           "amount_capture_rest": 50,
           "amount_capture_rest_with_partial_cancel": 50,
           "amount_captured": 0,
           "amount_left": 50,
           "amount_refund_rest": 50,
           "amount_refund_rest_with_partial_capture": 0,
           "amount_refunded": 0,
           "currency": "EUR",
           "total": 50,
           "total_left": 50,
           "pos_merchant_mode": true,
           "pos_verify_type": 1
         },
         "billing_address": {
           "salutation": "SALUTATION_MR",
           "first_name": "Test First_name",
           "last_name": "Test Last_name",
           "email": "test@test.com",
           "country": "DE",
           "country_name": "Germany",
           "city": "Hamburg",
           "zip_code": "12345",
           "street": "Rödingsmarkt"
         },
         "business": {
           "uuid": "{{businessId}}"
         },
         "cart": {
           "available_refund_items": [
             {
               "count": 1,
               "item_uuid": "f83c9c9f-77eb-464a-9ef3-95f572301d2c"
             }
           ],
           "items": [
             {
               "uuid": "f83c9c9f-77eb-464a-9ef3-95f572301d2c",
               "name": "test item",
               "identifier": "c4bce8c1-6572-43fc-8fc9-0f8f0a5efad1",
               "price": 50,
               "price_net": 10,
               "vat_rate": 10,
               "quantity": 1,
               "thumbnail": "https://payeverstaging.blob.core.windows.net/products/image_test"
             }
           ]
         },
         "channel": {
           "name": "pos"
         },
         "channel_set": {
           "uuid": "7c2298a7-a172-4048-8977-dbff24dec100"
         },
         "customer": {
           "email": "test@test.com",
           "name": "Customer Test"
         },
         "details": {
           "order": {
             "reference": "f3d44333-21e2-4f0f-952b-72ac2dfb8fc9"
           }
         },
         "history": [
           {
             "action": "test_action"
           }
         ],
         "merchant": {
           "email": "testcases@merchant.com",
           "name": "Test Merchant"
         },
         "payment_flow": {
           "id": "2"
         },
         "payment_option": {
           "down_payment": 0,
           "id": 1,
           "payment_fee": 0,
           "type": "payex_creditcard"
         },
         "shipping": {
           "address": {
             "salutation": "SALUTATION_MR",
             "first_name": "First name Shipping",
             "last_name": "Last_name Shipping",
             "email": "test_shipping@test.com",
             "country": "DE",
             "country_name": "Germany",
             "city": "Hamburg",
             "zip_code": "12345",
             "street": "Rödingsmarkt shipping"
           },
           "delivery_fee": 2,
           "method_name": "some shipping name",
           "order_id": "5db105b8-2da6-421e-8e6a-1c67048cda2b"
         },
         "status": {
           "general": "Test status",
           "place": "paid",
           "specific": "Test specific status"
         },
         "store": {},
         "user": {}
      }
      """
    Examples:
      | uri                                                                                   | token                                                                                                                     |
      | /api/business/{{businessId}}/detail/ad738281-f9f0-4db7-a4f6-670b0dff5327              | {"email": "email@email.com","roles": [{"name": "merchant","permissions": [{"businessId": "{{businessId}}","acls": []}]}]} |
      | /api/business/{{businessId}}/detail/reference/f3d44333-21e2-4f0f-952b-72ac2dfb8fc9    | {"email": "email@email.com","roles": [{"name": "merchant","permissions": [{"businessId": "{{businessId}}","acls": []}]}]} |
      | /api/business/{{businessId}}/detail/original_id/440ec879-7f02-48d4-9ffb-77adfaf79a06  | {"email": "email@email.com","roles": [{"name": "merchant","permissions": [{"businessId": "{{businessId}}","acls": []}]}]} |
      | /api/admin/detail/ad738281-f9f0-4db7-a4f6-670b0dff5327                                | {"email": "email@email.com","roles": [{"name": "admin","permissions": []}]}                                               |
      | /api/admin/detail/reference/f3d44333-21e2-4f0f-952b-72ac2dfb8fc9                      | {"email": "email@email.com","roles": [{"name": "admin","permissions": []}]}                                               |
      | /api/user/detail/ad738281-f9f0-4db7-a4f6-670b0dff5327                                 | {"id":"08a3fac8-43ef-4998-99aa-cabc97a39261","email": "email@email.com","roles": [{"name": "user","permissions": []}]}    |
      | /api/business/{{businessId}}/transaction/ad738281-f9f0-4db7-a4f6-670b0dff5327/details | {"email": "email@email.com","roles": [{"name": "merchant","permissions": [{"businessId": "{{businessId}}","acls": []}]}]} |
      | /api/admin/transaction/ad738281-f9f0-4db7-a4f6-670b0dff5327/details                   | {"email": "email@email.com","roles": [{"name": "admin","permissions": []}]}                                               |
      | /api/user/transaction/ad738281-f9f0-4db7-a4f6-670b0dff5327/details                    | {"id":"08a3fac8-43ef-4998-99aa-cabc97a39261","email": "email@email.com","roles": [{"name": "user","permissions": []}]}    |

  Scenario: Should cancel new transaction notification
    Given I authenticate as a user with the following data:
      """
      {"email": "email@email.com","roles": [{"name": "merchant","permissions": [{"businessId": "{{businessId}}","acls": []}]}]}
      """
    And I use DB fixture "transactions/transaction-details"
    And I mock RPC request "payment_option.payex_creditcard.action" to "rpc_payment_payex" with:
      """
      {
        "requestPayload": {
          "action": "action.list"
        },
        "responsePayload": "s:80:\"{\"payload\":{\"status\":\"OK\",\"result\":{\"test_action\":true,\"another_action\":false}}}\";"
      }
      """
    When I send a GET request to "/api/business/{{businessId}}/detail/ad738281-f9f0-4db7-a4f6-670b0dff5327"
    Then print last response
    And the response status code should be 200
    And RabbitMQ exchange "async_events" should contain following ordered messages:
      """
      [
        {
          "name": "notifications.event.notification.cancel",
          "payload": {
            "kind": "business",
            "entity": "36bf8981-8827-4c0c-a645-02d9fc6d72c8",
            "app": "transactions",
            "message": "notification.transactions.title.new_transaction",
            "data": {
              "transactionId": "ad738281-f9f0-4db7-a4f6-670b0dff5327"
            }
          }
        }
      ]
      """

  Scenario Outline: Should always return latest transaction by reference
    Given I authenticate as a user with the following data:
      """
      <token>
      """
    And I use DB fixture "transactions/transaction-details-reference"
    And I mock RPC request "payment_option.payex_creditcard.action" to "rpc_payment_payex" with:
      """
      {
        "requestPayload": {
          "action": "action.list"
        },
        "responsePayload": "s:80:\"{\"payload\":{\"status\":\"OK\",\"result\":{\"test_action\":true,\"another_action\":false}}}\";"
      }
      """
    When I send a GET request to "<uri>"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
         "actions": [],
         "transaction": {
           "original_id": "ad738281-f9f0-4db7-a4f6-0000bb0000bb",
           "uuid": "ad738281-f9f0-4db7-a4f6-0000bb0000bb",
           "amount": 50,
           "amount_refunded": 0,
           "amount_refund_rest": 50,
           "currency": "EUR",
           "total": 50
         },
         "billing_address": {
           "salutation": "SALUTATION_MR",
           "first_name": "Test First_name",
           "last_name": "Test Last_name",
           "email": "test@test.com",
           "country": "DE",
           "country_name": "Germany",
           "city": "Hamburg",
           "zip_code": "12345",
           "street": "Rödingsmarkt"
         },
         "business": {
           "uuid": "{{businessId}}"
         },
         "cart": {
           "available_refund_items": [
             {
               "count": 1,
               "item_uuid": "f83c9c9f-77eb-464a-9ef3-95f572301d2c"
             }
           ],
           "items": [
             {
               "uuid": "f83c9c9f-77eb-464a-9ef3-95f572301d2c",
               "name": "test item",
               "identifier": "c4bce8c1-6572-43fc-8fc9-0f8f0a5efad1",
               "price": 50,
               "price_net": 10,
               "vat_rate": 10,
               "quantity": 1,
               "thumbnail": "https://payeverstaging.blob.core.windows.net/products/image_test"
             }
           ]
         },
         "channel": {
           "name": "pos"
         },
         "channel_set": {
           "uuid": "7c2298a7-a172-4048-8977-dbff24dec100"
         },
         "customer": {
           "email": "test@test.com",
           "name": "Customer Test"
         },
         "details": {
           "order": {
             "reference": "some-reference-1"
           }
         },
         "history": [
           {
             "action": "test_action"
           }
         ],
         "merchant": {
           "email": "testcases@merchant.com",
           "name": "Test Merchant"
         },
         "payment_flow": {
           "id": "3"
         },
         "payment_option": {
           "down_payment": 0,
           "id": 1,
           "payment_fee": 0,
           "type": "payex_creditcard"
         },
         "shipping": {
           "address": {
             "salutation": "SALUTATION_MR",
             "first_name": "First name Shipping",
             "last_name": "Last_name Shipping",
             "email": "test_shipping@test.com",
             "country": "DE",
             "country_name": "Germany",
             "city": "Hamburg",
             "zip_code": "12345",
             "street": "Rödingsmarkt shipping"
           },
           "delivery_fee": 2,
           "method_name": "some shipping name",
           "order_id": "5db105b8-2da6-421e-8e6a-1c67048cda2b"
         },
         "status": {
           "general": "Test status",
           "place": "paid",
           "specific": "Test specific status"
         },
         "store": {},
         "user": {}
      }
      """
    Examples:
      | uri                                                            | token                                                                                                                     |
      | /api/business/{{businessId}}/detail/reference/some-reference-1 | {"email": "email@email.com","roles": [{"name": "merchant","permissions": [{"businessId": "{{businessId}}","acls": []}]}]} |

  Scenario Outline: Get transaction actions
    Given I authenticate as a user with the following data:
      """
      <token>
      """
    And I use DB fixture "transactions/transaction-details"
    And I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "post",
        "url": "*/api/business/{{businessId}}/integration/payex_creditcard/issuer/aci/action/action-list",
        "body": "{\"paymentId\":\"{{transactionId}}\"}",
        "headers": {
          "Accept": "application/json, text/plain, */*",
          "Content-Type": "application/json;charset=utf-8",
          "authorization": "*"
        }
      },
      "response": {
        "status": 200,
        "body": {
          "test_action":true,
          "another_action":false
        }
      }
    }
    """
    And I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "post",
        "url": "*/api/business/{{businessId}}/integration/payex_creditcard/issuer/aci/action/action-options",
        "body": "{\"paymentId\":\"{{transactionId}}\"}",
        "headers": {
          "Accept": "application/json, text/plain, */*",
          "Content-Type": "application/json;charset=utf-8",
          "authorization": "*"
        }
      },
      "response": {
        "status": 200,
        "body": [
          {
            "action": "test_action",
            "allowed": true,
            "isOptional": false,
            "partialAllowed": true
          },
          {
            "action": "another_action",
            "allowed": false,
            "isOptional": false,
            "partialAllowed": true
          }
        ]
      }
    }
    """
    When I send a GET request to "<uri>"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      [
        {
          "action": "test_action",
          "enabled": true
        },
        {
          "action": "another_action",
          "enabled": false
        }
      ]
      """
    Examples:
      | uri                                                                                   | token                                                                                                                     |
      | /api/business/{{businessId}}/transaction/ad738281-f9f0-4db7-a4f6-670b0dff5327/actions | {"email": "email@email.com","roles": [{"name": "merchant","permissions": [{"businessId": "{{businessId}}","acls": []}]}]} |
      | /api/admin/transaction/ad738281-f9f0-4db7-a4f6-670b0dff5327/actions                   | {"email": "email@email.com","roles": [{"name": "admin","permissions": []}]}                                               |
      | /api/user/transaction/ad738281-f9f0-4db7-a4f6-670b0dff5327/actions                    | {"id":"08a3fac8-43ef-4998-99aa-cabc97a39261","email": "email@email.com","roles": [{"name": "user","permissions": []}]}    |

  Scenario: Download contract
    Given I authenticate as a user with the following data:
    """
    {"email": "email@email.com","roles": [{"name": "merchant","permissions": [{"businessId": "{{businessId}}","acls": []}]}]}
    """
    And I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "get",
        "url": "*/api/download-resource/business/{{businessId}}/integration/instant_payment/action/contract?paymentId={{transactionId}}&rawData=true",
        "headers": {
          "Accept": "application/json, text/plain, */*",
          "authorization": "*"
        }
      },
      "response": {
        "status": 200,
        "body": {
          "contentType": "application/pdf",
          "filenameWithExtension": "contract.pdf",
          "base64Content": "base64_contract_pdf"
        }
      }
    }
    """
    And I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "transactions",
          "*"
         ],
        "result": {}
      }
      """
    And I use DB fixture "transactions/third-party-payment"
    When I send a GET request to "/api/business/{{businessId}}/download-contract/{{transactionId}}"
    Then the response status code should be 200
    And the response header "Content-Type" should have value "application/pdf"
    And the response header "Content-Disposition" should have value "attachment; filename=contract.pdf"
