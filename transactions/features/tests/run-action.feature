Feature: Run payment action

  Background:
    Given I remember as "businessId" following value:
      """
      "36bf8981-8827-4c0c-a645-02d9fc6d72c8"
      """
    Given I remember as "transactionId" following value:
      """
      "ad738281-f9f0-4db7-a4f6-670b0dff5327"
      """
    Given I remember as "transactionReference" following value:
      """
      "f3d44333-21e2-4f0f-952b-72ac2dfb8fc9"
      """

  Scenario Outline: Insufficient token permissions
    Given I authenticate as a user with the following data:
      """
      <token>
      """
    When I send a POST request to "<path>" with json:
      """
        {
          "fields": {}
        }
      """
    Then the response status code should be 403
    Examples:
      | path                                                       | token                                                                                                                                           |
      | /api/business/{{businessId}}/{{transactionId}}/action/test | {"email": "email@email.com","roles": [{"name": "merchant","permissions": [{"businessId": "36bf8981-0000-0000-0000-02d9fc6d72c8","acls": []}]}]} |
      | /api/business/{{businessId}}/{{transactionId}}/action/test | {"email": "email@email.com","roles": [{"name": "user","permissions": []}]}                                                                      |
      | /api/admin/{{transactionId}}/action/test                   | {"email": "email@email.com","roles": [{"name": "user","permissions": []}]}                                                                      |

  Scenario Outline: Run payment action with seller data in payload
    Given I authenticate as a user with the following data:
      """
      <token>
      """
    Given I use DB fixture "transactions/run-actions"
    And I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "post",
        "url": "*/api/business/{{businessId}}/integration/payex_creditcard/action/action-shipping-goods",
        "body": "{\"fields\":{\"seller\":{\"id\":\"test_id\",\"first_name\":\"test_first\",\"last_name\":\"test_last\",\"email\":\"test_email\"}},\"paymentId\":\"{{transactionId}}\"}",
        "headers": {
          "Accept": "application/json, text/plain, */*",
          "Content-Type": "application/json;charset=utf-8",
          "authorization": "*"
        }
      },
      "response": {
        "status": 200,
        "body": {}
      }
    }
    """
    And I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "post",
        "url": "*/api/business/{{businessId}}/integration/payex_creditcard/action/action-list",
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
        "url": "*/api/business/{{businessId}}/integration/payex_creditcard/action/action-options",
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
    And I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "transactions",
          {
            "action_running": false,
            "santander_applications": [],
            "uuid": "{{transactionId}}"
          }
         ],
        "result": {}
      }
      """
    And I mock Elasticsearch method "search" with:
      """
      {
        "arguments": [
          "folder_transactions"
        ]
      }
      """
    And I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "folder_transactions"
         ]
      }
      """
    When I send a POST request to "<path>" with json:
      """
        {
          "fields": {
            "seller": {
              "id": "test_id",
              "first_name": "test_first",
              "last_name": "test_last",
              "email": "test_email"
            }
          }
        }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
        {
           "actions": [
             {
               "action": "test_action",
               "enabled": true,
               "isOptional": false,
               "partialAllowed": true
             },
             {
               "action": "another_action",
               "enabled": false,
               "isOptional": false,
               "partialAllowed": true
             }
           ],
           "transaction": {
             "id": "*",
             "original_id": "*",
             "uuid": "ad738281-f9f0-4db7-a4f6-670b0dff5327",
             "amount": 50,
             "amount_cancel_rest": 0,
             "amount_canceled": 0,
             "amount_capture_rest": 0,
             "amount_capture_rest_with_partial_cancel": 0,
             "amount_captured": 100,
             "amount_left": 50,
             "amount_refund_rest": 50,
             "amount_refund_rest_with_partial_capture": 100,
             "amount_refunded": 0,
             "currency": "EUR",
             "total": 100,
             "total_left": 100,
             "delivery_fee_canceled": 0,
             "delivery_fee_captured": 0,
             "delivery_fee_left": 0,
             "delivery_fee_refunded": 0,
             "created_at": "*",
             "updated_at": "*"
           },
           "billing_address": {
             "_id": "*",
             "salutation": "SALUTATION_MR",
             "first_name": "*",
             "last_name": "*",
             "email": "*",
             "country": "DE",
             "country_name": "Germany",
             "city": "Hamburg",
             "zip_code": "12345",
             "street": "Rödingsmarkt",
             "id": "*"
           },
           "business": {
             "uuid": "36bf8981-8827-4c0c-a645-02d9fc6d72c8"
           },
           "cart": {
             "available_refund_items": [
               {
                 "count": 1,
                 "identifier": "*",
                 "item_uuid": "*"
               }
             ],
             "items": [
               {
                 "uuid": "*",
                 "name": "*",
                 "identifier": "*",
                 "price": 100,
                 "price_net": 0,
                 "vat_rate": 0,
                 "quantity": 1,
                 "thumbnail": "*",
                 "options": [],
                 "id": null
               }
             ]
           },
           "channel": {
             "name": "pos"
           },
           "channel_set": {
             "uuid": "*"
           },
           "customer": {
             "email": "*",
             "name": "*"
           },
           "details": {
             "order": {
               "reference": "*"
             }
           },
           "history": [
             {
               "action": "shipping_goods",
               "amount": 100,
               "created_at": "*",
               "payment_status": "STATUS_PAID",
               "reason": "",
               "reference": null,
               "user": {
                 "id": "test_id",
                 "first_name": "test_first",
                 "last_name": "test_last",
                 "email": "test_email"
               }
             }
           ],
           "merchant": {
             "email": "*",
             "name": "*"
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
               "_id": "*",
               "salutation": "SALUTATION_MR",
               "first_name": "*",
               "last_name": "*",
               "email": "*",
               "country": "DE",
               "country_name": "Germany",
               "city": "Hamburg",
               "zip_code": "12345",
               "street": "Rödingsmarkt",
               "id": "*"
             },
             "delivery_fee": 0,
             "method_name": "*",
             "order_id": "*"
           },
           "status": {
             "general": "STATUS_PAID",
             "place": "paid",
             "specific": "PAID"
           },
           "store": {},
           "user": {}
         }
      """
    Examples:
      | path                                                                 | token                                                                                                                     |
      | /api/business/{{businessId}}/{{transactionId}}/action/shipping_goods | {"email": "email@email.com","roles": [{"name": "merchant","permissions": [{"businessId": "{{businessId}}","acls": []}]}]} |
      | /api/admin/{{transactionId}}/action/shipping_goods                   | {"email": "email@email.com","roles": [{"name": "admin","permissions": []}]}                                               |

  Scenario Outline: Run payment action for santander_installment_dk, should remove edit action, because it is not implemented at FE
    Given I authenticate as a user with the following data:
    """
    <token>
    """
    And I use DB fixture "transactions/run-actions-santander-dk"
    And I mock an axios request with parameters:
    """
        {
          "request": {
            "method": "post",
            "url": "*/api/business/{{businessId}}/integration/santander_installment_dk/action/action-list",
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
              "refund": true,
              "edit": true,
              "shipping_goods": false
            }
          }
        }
        """
    When I send a GET request to "<path>"
    Then print last response
    And the response status code should be 200
    And the response should not contain json:
    """
    {
      "actions": [
        {
          "action": "edit",
          "enabled": true
        }
      ]
    }
    """
    Examples:
      | path                                                  | token                                                                                                                     |
      | /api/business/{{businessId}}/detail/{{transactionId}} | {"email": "email@email.com","roles": [{"name": "merchant","permissions": [{"businessId": "{{businessId}}","acls": []}]}]} |
      | /api/admin/detail/{{transactionId}}                   | {"email": "email@email.com","roles": [{"name": "admin","permissions": []}]}                                               |

