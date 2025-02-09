@save-history
Feature: Save history records
  Background:
    Given I remember as "businessId" following value:
    """
    "36bf8981-8827-4c0c-a645-02d9fc6d72c8"
    """
    Given I remember as "transactionId" following value:
    """
    "ad738281-f9f0-4db7-a4f6-670b0dff5327"
    """

  Scenario: Payment action update status
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@email.com",
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
        ]
      }
      """
    Given I use DB fixture "transactions/transaction-status-update"
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
    And I mock Elasticsearch method "search" with:
      """
      {
        "arguments": [
          "transactions",
          {
            "from": 0,
            "query": {
              "bool": {
                "must": [
                  {
                    "match_phrase": {
                      "uuid": "*"
                    }
                  }
                ],
                "must_not": []
              }
            },
            "size": 10,
            "sort": [
              {
                "created_at": "asc"
              }
            ]
          }
        ]
      }
      """
    And I mock an axios request with parameters:
      """
      {
        "request": {
          "method": "post",
          "url": "*/api/business/{{businessId}}/integration/santander_installment/action/action-shipping-goods"
        },
        "response": {
          "status": 200,
          "body": "{\"payment\":{\"status\":\"STATUS_PAID\"}}"
        }
      }
      """
    And I mock an axios request with parameters:
      """
      {
        "request": {
          "method": "post",
          "url": "*/api/business/{{businessId}}/integration/santander_installment/action/action-list"
        },
        "response": {
          "status": 200,
          "body": "{}"
        }
      }
      """
    And I mock an axios request with parameters:
      """
      {
        "request": {
          "method": "post",
          "url": "*/api/business/{{businessId}}/integration/santander_installment/action/action-options"
        },
        "response": {
          "status": 200,
          "body": "{}"
        }
      }
      """

    When I send a POST request to "/api/business/{{businessId}}/{{transactionId}}/action/shipping_goods" with json:
      """
        {
          "fields": {}
        }
      """
    Then print last response

    When look for model "Transaction" by following JSON and remember as "transaction":
      """
      {
        "uuid": "{{transactionId}}"
      }
      """
    Then model "Transaction" with id "{{transaction._id}}" should contain json:
      """
      {
        "history": [
          {
            "action" : "status_changed",
            "payment_status" : "STATUS_PAID"
          }
        ]
      }
      """

  Scenario: Payment action completed for POS DE edit action should be saved
    Given I use DB fixture "transactions/transaction-for-history-pos-de"
    And I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "transactions",
          {
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
    When I publish in RabbitMQ channel "async_events_transactions_micro" message with json:
      """
      {
        "name": "payever.event.payment.action.completed",
        "payload": {
          "payment": {
            "id": "b140034c74959b9f45c383e33f937e56",
            "uuid": "{{transactionId}}",
            "amount": 5290,
            "total": 5290,
            "currency": "NOK",
            "reference": "1906191249319025",
            "customer_name": "Test Customer",
            "customer_email": "test@test.com",
            "specific_status": "APPROVED",
            "status": "STATUS_IN_PROCESS",
            "address": {
              "country": "NO",
              "city": "HAUGLANDSHELLA",
              "zip_code": "5310",
              "street": "Ravnetua 21",
              "phone": "90782130",
              "salutation": "SALUTATION_MR",
              "first_name": "Christian",
              "last_name": "Breivik"
            },
            "fee": 0,
            "delivery_fee": 0,
            "payment_fee": 0,
            "down_payment": 0,
            "place": "cancelled",
            "business_payment_option": {
              "payment_option": {
                "payment_method": "santander_invoice_no"
              }
            },
            "created_at": "2019-06-19T10:50:00+00:00"
          },
          "action": "edit",
          "data": {
            "payment_status": "STATUS_IN_PROCESS"
          }
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_transactions_micro" channel
    When look for model "HistoryCommon" by following JSON and remember as "history":
      """
      {
        "transaction_id": "{{transactionId}}"
      }
      """
    Then stored value "history" should contain json:
      """
      {
        "action" : "edit",
        "payment_status" : "STATUS_IN_PROCESS"
      }
      """

  Scenario: Payment action completed for non POS DE edit action should be ignored
    Given I use DB fixture "transactions/transaction-for-history"
    And I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "transactions",
          {
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
    When I publish in RabbitMQ channel "async_events_transactions_micro" message with json:
      """
      {
        "name": "payever.event.payment.action.completed",
        "payload": {
          "payment": {
            "id": "b140034c74959b9f45c383e33f937e56",
            "uuid": "{{transactionId}}",
            "amount": 5290,
            "total": 5290,
            "currency": "NOK",
            "reference": "1906191249319025",
            "customer_name": "Test Customer",
            "customer_email": "test@test.com",
            "specific_status": "APPROVED",
            "status": "STATUS_IN_PROCESS",
            "address": {
              "country": "NO",
              "city": "HAUGLANDSHELLA",
              "zip_code": "5310",
              "street": "Ravnetua 21",
              "phone": "90782130",
              "salutation": "SALUTATION_MR",
              "first_name": "Christian",
              "last_name": "Breivik"
            },
            "fee": 0,
            "delivery_fee": 0,
            "payment_fee": 0,
            "down_payment": 0,
            "place": "cancelled",
            "business_payment_option": {
              "payment_option": {
                "payment_method": "santander_invoice_no"
              }
            },
            "created_at": "2019-06-19T10:50:00+00:00"
          },
          "action": "edit",
          "data": {
            "payment_status": "STATUS_IN_PROCESS"
          }
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_transactions_micro" channel
    When look for model "Transaction" by following JSON and remember as "transaction":
      """
      {
        "uuid": "{{transactionId}}"
      }
      """
    Then model "Transaction" with id "{{transaction._id}}" should not contain json:
      """
      {
        "history": [
          {
            "action" : "edit",
            "payment_status" : "STATUS_IN_PROCESS"
          }
        ]
      }
      """

  Scenario: Payment action completed for not allowed action should be ignored
    Given I use DB fixture "transactions/transaction-for-history"
    And I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "transactions",
          {
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
    When I publish in RabbitMQ channel "async_events_transactions_micro" message with json:
      """
      {
        "name": "payever.event.payment.action.completed",
        "payload": {
          "payment": {
            "id": "b140034c74959b9f45c383e33f937e56",
            "uuid": "{{transactionId}}",
            "amount": 5290,
            "total": 5290,
            "currency": "NOK",
            "reference": "1906191249319025",
            "customer_name": "Test Customer",
            "customer_email": "test@test.com",
            "specific_status": "APPROVED",
            "status": "STATUS_IN_PROCESS",
            "address": {
              "country": "NO",
              "city": "HAUGLANDSHELLA",
              "zip_code": "5310",
              "street": "Ravnetua 21",
              "phone": "90782130",
              "salutation": "SALUTATION_MR",
              "first_name": "Christian",
              "last_name": "Breivik"
            },
            "fee": 0,
            "delivery_fee": 0,
            "payment_fee": 0,
            "down_payment": 0,
            "place": "cancelled",
            "business_payment_option": {
              "payment_option": {
                "payment_method": "santander_invoice_no"
              }
            },
            "created_at": "2019-06-19T10:50:00+00:00"
          },
          "action": "shipping_goods",
          "data": {
            "amount": 5290
          }
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_transactions_micro" channel
    When look for model "Transaction" by following JSON and remember as "transaction":
      """
      {
        "uuid": "{{transactionId}}"
      }
      """
    Then model "Transaction" with id "{{transaction._id}}" should not contain json:
      """
      {
        "history": [
          {
            "action" : "shipping_goods",
            "amount" : 5290
          }
        ]
      }
      """

  Scenario: Payment action completed for not allowed action but forced should be processed
    Given I use DB fixture "transactions/transaction-for-history"
    And I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "transactions",
          {
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
    When I publish in RabbitMQ channel "async_events_transactions_micro" message with json:
      """
      {
        "name": "payever.event.payment.action.completed",
        "payload": {
          "payment": {
            "id": "b140034c74959b9f45c383e33f937e56",
            "uuid": "{{transactionId}}",
            "amount": 5290,
            "total": 5290,
            "currency": "NOK",
            "reference": "1906191249319025",
            "customer_name": "Test Customer",
            "customer_email": "test@test.com",
            "specific_status": "APPROVED",
            "status": "STATUS_IN_PROCESS",
            "address": {
              "country": "NO",
              "city": "HAUGLANDSHELLA",
              "zip_code": "5310",
              "street": "Ravnetua 21",
              "phone": "90782130",
              "salutation": "SALUTATION_MR",
              "first_name": "Christian",
              "last_name": "Breivik"
            },
            "fee": 0,
            "delivery_fee": 0,
            "payment_fee": 0,
            "down_payment": 0,
            "place": "cancelled",
            "business_payment_option": {
              "payment_option": {
                "payment_method": "santander_invoice_no"
              }
            },
            "created_at": "2019-06-19T10:50:00+00:00"
          },
          "action": "shipping_goods_forced",
          "data": {
            "amount": 5290
          }
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_transactions_micro" channel
    When look for model "HistoryShippingGoods" by following JSON and remember as "history":
      """
      {
        "transaction_id": "{{transactionId}}"
      }
      """
    Then stored value "history" should contain json:
      """
      {
        "action" : "shipping_goods",
        "amount" : 5290
      }
      """

  Scenario: Payment Email Sent
    Given I use DB fixture "transactions/transaction-for-history"
    And I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "transactions",
          {
            "uuid": "ad738281-f9f0-4db7-a4f6-670b0dff5327"
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
    When I publish in RabbitMQ channel "async_events_transactions_micro" message with json:
      """
      {
        "name": "mailer.event.payment-mail.sent",
        "payload": {
            "id": "242905da-16b0-4fd2-98c9-259b5aceb62f",
            "templateName": "some_template",
            "transactionId": "ad738281-f9f0-4db7-a4f6-670b0dff5327"
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_transactions_micro" channel
    When look for model "HistoryCommon" by following JSON and remember as "history":
      """
      {
        "transaction_id": "ad738281-f9f0-4db7-a4f6-670b0dff5327"
      }
      """
    Then stored value "history" should contain json:
      """
      {
        "action" : "email_sent",
        "mail_event": {
          "event_id": "242905da-16b0-4fd2-98c9-259b5aceb62f",
          "template_name": "some_template"
        }
      }
      """

  Scenario: Shipping label downloaded
    Given I use DB fixture "transactions/transaction-for-history"
    And I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "transactions",
          {
            "uuid": "ad738281-f9f0-4db7-a4f6-670b0dff5327"
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
    When I publish in RabbitMQ channel "async_events_transactions_micro" message with json:
      """
      {
        "name": "shipping.event.shipping-label.downloaded",
        "payload": {
          "shippingOrder": {
            "id": "3263d46c-755d-4fe6-b02e-ede4d63748b4"
          }
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_transactions_micro" channel
    When look for model "HistoryCommon" by following JSON and remember as "history":
      """
      {
        "transaction_id": "ad738281-f9f0-4db7-a4f6-670b0dff5327"
      }
      """
    Then stored value "history" should contain json:
      """
      {
        "action" : "shipping-label-downloaded"
      }
      """

  Scenario: Shipping slip downloaded
    Given I use DB fixture "transactions/transaction-for-history"
    And I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "transactions",
          {
            "uuid": "ad738281-f9f0-4db7-a4f6-670b0dff5327"
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
    When I publish in RabbitMQ channel "async_events_transactions_micro" message with json:
      """
      {
        "name": "shipping.event.shipping-slip.downloaded",
        "payload": {
          "shippingOrder": {
            "id": "3263d46c-755d-4fe6-b02e-ede4d63748b4"
          }
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_transactions_micro" channel
    When look for model "HistoryCommon" by following JSON and remember as "history":
      """
      {
        "transaction_id": "ad738281-f9f0-4db7-a4f6-670b0dff5327"
      }
      """
    Then stored value "history" should contain json:
      """
      {
        "action" : "shipping-slip-downloaded"
      }
      """
