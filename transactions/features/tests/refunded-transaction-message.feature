Feature: Refunded transactions message sending
  Background:
    Given I remember as "businessId" following value:
    """
    "36bf8981-8827-4c0c-a645-02d9fc6d72c8"
    """
    Given I remember as "transactionId" following value:
    """
    "ad738281-f9f0-4db7-a4f6-670b0dff5327"
    """
  Scenario: Payment action "refund" completed
    Given I authenticate as a user with the following data:
    """
    {"email": "email@email.com","roles": [{"name": "merchant","permissions": [{"businessId": "{{businessId}}","acls": []}]}]}
    """
    And I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "post",
        "url": "*/api/business/{{businessId}}/integration/stripe/action/action-refund",
        "body": "{\"fields\":{\"amount\":25},\"paymentId\":\"{{transactionId}}\"}",
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
        "url": "*/api/business/{{businessId}}/integration/stripe/action/action-list",
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
          "refund": true
        }
      }
    }
    """
    And I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "post",
        "url": "*/api/business/{{businessId}}/integration/stripe/action/action-options",
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
          "refund": true
        }
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
            "_id": "*",
            "uuid": "{{transactionId}}",
            "status": "STATUS_ACCEPTED",
            "currency": "EUR",
            "customer_name": "Customer Test",
            "customer_email": "test@test.com",
            "channel": "pos",
            "amount": 10000,
            "total": 10500,
            "items": [
             {
               "uuid": "f83c9c9f-77eb-464a-9ef3-95f572301d2c",
               "name": "test item",
               "identifier": "c4bce8c1-6572-43fc-8fc9-0f8f0a5efad1",
               "price": 5000,
               "price_net": 0,
               "vat_rate": 0,
               "quantity": 1,
               "thumbnail": "https://payeverstaging.blob.core.windows.net/products/image_test",
               "options": []
             },
             {
               "uuid": "c5644efe-583a-44aa-910c-664ee941e1e2",
               "name": "test item",
               "identifier": "3a6bd3ae-3b30-41a4-803f-e457d6113279",
               "price": 2500,
               "price_net": 0,
               "vat_rate": 0,
               "quantity": 2,
               "thumbnail": "https://payeverstaging.blob.core.windows.net/products/image_test",
               "options": []
             }
            ],
            "payment_details": "{}",
            "business_option_id": 1,
            "reference": "f3d44333-21e2-4f0f-952b-72ac2dfb8fc9",
            "delivery_fee": 200,
            "payment_fee": 300,
            "down_payment": 0,
            "shipping_method_name": "some shipping name",
            "billing_address": {
             "_id": "*",
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
            "type": "stripe",
            "business_uuid": "36bf8981-8827-4c0c-a645-02d9fc6d72c8",
            "merchant_name": "Test Merchant",
            "merchant_email": "testcases@merchant.com",
            "payment_flow_id": "2",
            "channel_set_uuid": "7c2298a7-a172-4048-8977-dbff24dec100",
            "original_id": "440ec879-7f02-48d4-9ffb-77adfaf79a06",
            "history": [
             {
               "action": "test_action",
               "created_at": "*"
             },
             {
               "action": "refund",
               "amount": 2500,
               "created_at": "*",
               "payment_status": "STATUS_ACCEPTED",
               "reason": "",
               "user": {
                 "email": "email@email.com",
                 "first_name": "default",
                 "id": "*",
                 "last_name": "default"
               }
             }
            ],
            "place": "paid",
            "specific_status": "NONE",
            "shipping_address": {
             "_id": "*",
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
            "shipping_order_id": "5db105b8-2da6-421e-8e6a-1c67048cda2b",
            "created_at": "*",
            "updated_at": "*",
            "user_uuid": "*",
            "captured_items": [],
            "refunded_items": [],
            "__v": 0,
            "amount_refunded": 25,
            "delivery_fee_refunded": 0,
            "amount_captured": 0,
            "delivery_fee_captured": 0,
            "amount_canceled": 0,
            "delivery_fee_canceled": 0,
            "amount_refund_rest": 75,
            "amount_refund_rest_with_partial_capture": 0,
            "amount_capture_rest": 80,
            "amount_capture_rest_with_partial_cancel": 105,
            "amount_cancel_rest": 105,
            "available_refund_items": [
             {
               "count": 1,
               "identifier": "c4bce8c1-6572-43fc-8fc9-0f8f0a5efad1",
               "item_uuid": "f83c9c9f-77eb-464a-9ef3-95f572301d2c"
             },
             {
               "count": 2,
               "identifier": "3a6bd3ae-3b30-41a4-803f-e457d6113279",
               "item_uuid": "c5644efe-583a-44aa-910c-664ee941e1e2"
             }
            ],
            "amount_left": 75,
            "delivery_fee_left": 2,
            "total_left": 80,
            "id": "*"
          }
         ],
        "result": {}
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
            "_id": "*",
            "uuid": "{{transactionId}}",
            "status": "STATUS_ACCEPTED",
            "currency": "EUR",
            "customer_name": "Customer Test",
            "customer_email": "test@test.com",
            "channel": "pos",
            "amount": 5000,
            "total": 5000,
            "items": [
             {
               "uuid": "f83c9c9f-77eb-464a-9ef3-95f572301d2c",
               "name": "test item",
               "identifier": "c4bce8c1-6572-43fc-8fc9-0f8f0a5efad1",
               "price": 5000,
               "price_net": 1000,
               "vat_rate": 1000,
               "quantity": 1,
               "thumbnail": "https://payeverstaging.blob.core.windows.net/products/image_test",
               "options": []
             }
            ],
            "payment_details": "{}",
            "business_option_id": 1,
            "reference": "f3d44333-21e2-4f0f-952b-72ac2dfb8fc9",
            "delivery_fee": 200,
            "payment_fee": 0,
            "down_payment": 0,
            "shipping_method_name": "some shipping name",
            "billing_address": {
             "_id": "*",
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
            "type": "instant_payment",
            "business_uuid": "36bf8981-8827-4c0c-a645-02d9fc6d72c8",
            "merchant_name": "Test Merchant",
            "merchant_email": "testcases@merchant.com",
            "payment_flow_id": "2",
            "channel_set_uuid": "7c2298a7-a172-4048-8977-dbff24dec100",
            "original_id": "ad738281-f9f0-4db7-a4f6-670b0dff5327",
            "history": [
             {
               "action": "test_action",
               "created_at": "*"
             },
             {
               "action": "contract_downloaded",
               "amount": 5000,
               "created_at": "*",
               "payment_status": "STATUS_ACCEPTED",
               "user": {
                 "email": "email@email.com",
                 "first_name": "default",
                 "id": "08a3fac8-43ef-4998-99aa-cabc97a39261",
                 "last_name": "default"
               }
             }
            ],
            "place": "paid",
            "specific_status": "NONE",
            "shipping_address": {
             "_id": "*",
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
            "shipping_order_id": "5db105b8-2da6-421e-8e6a-1c67048cda2b",
            "created_at": "*",
            "updated_at": "*",
            "user_uuid": "08a3fac8-43ef-4998-99aa-cabc97a39261",
            "captured_items": [],
            "refunded_items": [],
            "__v": 0,
            "amount_refunded": 0,
            "delivery_fee_refunded": 0,
            "amount_captured": 0,
            "delivery_fee_captured": 0,
            "amount_canceled": 0,
            "delivery_fee_canceled": 0,
            "amount_refund_rest": 50,
            "amount_refund_rest_with_partial_capture": 0,
            "amount_capture_rest": 50,
            "amount_capture_rest_with_partial_cancel": 50,
            "amount_cancel_rest": 50,
            "available_refund_items": [
             {
               "count": 1,
               "identifier": "c4bce8c1-6572-43fc-8fc9-0f8f0a5efad1",
               "item_uuid": "f83c9c9f-77eb-464a-9ef3-95f572301d2c"
             }
            ],
            "amount_left": 50,
            "delivery_fee_left": 2,
            "total_left": 50,
            "id": "*"
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
    And I use DB fixture "transactions/partial-capture/third-party-payment"
    When I send a POST request to "/api/business/{{businessId}}/{{transactionId}}/action/refund" with json:
    """
    {
      "fields": {
        "amount": 25
      }
    }
    """
    When look for model "Transaction" by following JSON and remember as "transaction":
      """
      {
        "uuid": "{{transactionId}}"
      }
      """
    Then print RabbitMQ message list
    Then RabbitMQ exchange "async_events" should contain following ordered messages:
    """
    [
      {
        "name": "transactions.event.payment.subtract",
        "payload": {
          "amount": 25,
          "business": {
            "id": "{{transaction.business_uuid}}"
          },
          "channel_set": {
            "id": "{{transaction.channel_set_uuid}}"
          },
          "date": "{{transaction.updated_at}}",
          "id": "{{transaction.uuid}}",
          "items": "{{transaction.items}}"
        }
      }
    ]
    """
