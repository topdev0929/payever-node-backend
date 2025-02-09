Feature: Process schedule from rabbit event
  Background:
    Given I remember as "businessId" following value:
    """
    "012c165f-8b88-405f-99e2-82f74339a757"
    """
    Given I remember as "scheduleId" following value:
    """
    "23e03d97-7ad8-4b16-ae32-51734cea5edd"
    """
    Given I remember as "paymentId" following value:
    """
    "3dc8e758-87e9-4175-b371-3310c041aa07"
    """
  Scenario: Process payment_action task, payment is found and sent to queue to execute action
    Given I use DB fixture "schedule/bus-message-schedule-action"
    Given I use DB fixture "schedule/payments"
    Given I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
    """
    {
      "name": "checkout.event.scheduled-task.execute",
      "payload": {
         "_id": "{{scheduleId}}",
         "businessId": "{{businessId}}",
         "task": "payment_action",
         "duration": {
            "type": "every",
            "unit": "day",
            "period": 5
         },
         "action": "cancel",
         "paymentMethod": "santander_installment",
         "enabled": true,
         "filter": {
          "status": "STATUS_IN_PROCESS"
         }
      }
    }
    """
    Then I process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then I look for model "Schedule" with id "{{scheduleId}}" and remember as "schedule"
    Then print storage key "schedule"
    Then stored value "schedule" should contain json:
    """
    {
       "_id": "{{scheduleId}}",
       "enabled": true,
       "businessId": "{{businessId}}",
       "task": "payment_action",
       "duration": {
          "type": "every",
          "unit": "day",
          "period": 5
       },
       "action": "cancel",
       "paymentMethod": "santander_installment",
       "filter": {
         "status": "STATUS_IN_PROCESS"
       },
       "lastRun": "2024-*"
    }
    """
    Then print RabbitMQ exchange "async_events" message list
    And RabbitMQ exchange "async_events" should contain following messages:
    """
    [
     {
       "name": "checkout.event.scheduled-payment-action.run",
       "payload": {
         "schedule": {
           "_id": "{{scheduleId}}",
           "businessId": "{{businessId}}",
           "task": "payment_action",
           "duration": {
              "type": "every",
              "unit": "day",
              "period": 5
           },
           "action": "cancel",
           "paymentMethod": "santander_installment",
           "enabled": true,
           "filter": {
             "status": "STATUS_IN_PROCESS"
           }
         },
         "paymentId": "{{paymentId}}"
       }
     }
    ]
    """

  Scenario: Process payment_link_reminder task, payment link is found and email is sent
    Given I use DB fixture "schedule/bus-message-schedule-link-reminder"
    Given I use DB fixture "schedule/payment-links"
    Given I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
    """
    {
      "name": "checkout.event.scheduled-task.execute",
      "payload": {
         "_id": "{{scheduleId}}",
         "businessId": "{{businessId}}",
         "task": "payment_link_reminder",
         "duration": {
            "type": "every",
            "unit": "day",
            "period": 5
         },
         "enabled": true
      }
    }
    """
    Then I process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then I look for model "Schedule" with id "{{scheduleId}}" and remember as "schedule"
    Then print storage key "schedule"
    Then stored value "schedule" should contain json:
    """
    {
       "_id": "{{scheduleId}}",
       "enabled": true,
       "businessId": "{{businessId}}",
       "task": "payment_link_reminder",
       "duration": {
          "type": "every",
          "unit": "day",
          "period": 5
       },
       "lastRun": "2024-*"
    }
    """
    Then print RabbitMQ exchange "async_events" message list
    And RabbitMQ exchange "async_events" should contain following messages:
    """
    [
       {
         "name": "payever.event.user.email",
         "payload": {
           "templateName": "payment.link.reminder",
           "to": "test@test.com",
           "variables": {
             "link": "https://checkout-backend.devpayever.com/api/payment/link/71d15d86-7d1d-4178-b0c8-1d4e1230b2c0"
           }
         }
       }
     ]
    """

  Scenario: Process payment_link_reminder task, payment link exists but its expired, email is NOT sent
    Given I use DB fixture "schedule/bus-message-schedule-link-reminder"
    Given I use DB fixture "schedule/payment-links-expired"
    Given I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
    """
    {
      "name": "checkout.event.scheduled-task.execute",
      "payload": {
         "_id": "{{scheduleId}}",
         "businessId": "{{businessId}}",
         "task": "payment_link_reminder",
         "duration": {
            "type": "every",
            "unit": "day",
            "period": 5
         },
         "enabled": true
      }
    }
    """
    Then I process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then print RabbitMQ exchange "async_events" message list
    And RabbitMQ exchange "async_events" should not contain following messages:
    """
    [
       {
         "name": "payever.event.user.email",
         "payload": {
           "templateName": "payment.link.reminder",
           "to": "test@test.com",
           "variables": {
             "link": "https://checkout-backend.devpayever.com/api/payment/link/71d15d86-7d1d-4178-b0c8-1d4e1230b2c0"
           }
         }
       }
     ]
    """

  Scenario: Process payment_link_reminder task, payment link exists but its reusable, email is NOT sent
    Given I use DB fixture "schedule/bus-message-schedule-link-reminder"
    Given I use DB fixture "schedule/payment-links-reusable"
    Given I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
    """
    {
      "name": "checkout.event.scheduled-task.execute",
      "payload": {
         "_id": "{{scheduleId}}",
         "businessId": "{{businessId}}",
         "task": "payment_link_reminder",
         "duration": {
            "type": "every",
            "unit": "day",
            "period": 5
         },
         "enabled": true
      }
    }
    """
    Then I process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then print RabbitMQ exchange "async_events" message list
    And RabbitMQ exchange "async_events" should not contain following messages:
    """
    [
       {
         "name": "payever.event.user.email",
         "payload": {
           "templateName": "payment.link.reminder",
           "to": "test@test.com",
           "variables": {
             "link": "https://checkout-backend.devpayever.com/api/payment/link/71d15d86-7d1d-4178-b0c8-1d4e1230b2c0"
           }
         }
       }
     ]
    """

  Scenario: Process payment_link_reminder task, payment link exists but it has payment assigned, email is NOT sent
    Given I use DB fixture "schedule/bus-message-schedule-link-reminder"
    Given I use DB fixture "schedule/payment-links-payment-exists"
    Given I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
    """
    {
      "name": "checkout.event.scheduled-task.execute",
      "payload": {
         "_id": "{{scheduleId}}",
         "businessId": "{{businessId}}",
         "task": "payment_link_reminder",
         "duration": {
            "type": "every",
            "unit": "day",
            "period": 5
         },
         "enabled": true
      }
    }
    """
    Then I process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then print RabbitMQ exchange "async_events" message list
    And RabbitMQ exchange "async_events" should not contain following messages:
    """
    [
       {
         "name": "payever.event.user.email",
         "payload": {
           "templateName": "payment.link.reminder",
           "to": "test@test.com",
           "variables": {
             "link": "https://checkout-backend.devpayever.com/api/payment/link/71d15d86-7d1d-4178-b0c8-1d4e1230b2c0"
           }
         }
       }
     ]
    """

  Scenario: Execute action for specific payment
    Given I use DB fixture "schedule/bus-message-schedule-action"
    Given I use DB fixture "schedule/payments"
    Given I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "post",
        "url": "*/api/business/{{businessId}}/{{paymentId}}/legacy-api-action/cancel",
        "body": "{}"
      },
      "response": {
        "status": 200,
        "body": {
          "id": "5c3de305d665630012908367",
          "original_id": "{{paymentId}}",
          "uuid": "{{paymentId}}",
          "action_running": false,
          "available_refund_items": [],
          "amount": 650,
          "billing_address": {
            "_id": "5d08cff769767a2294eda730",
            "country": "DE",
            "city": "Hamburg",
            "zip_code": "20457",
            "street": "Am Strandkai",
            "salutation": "SALUTATION_MR",
            "first_name": "Stub",
            "last_name": "Accepted",
            "id": "5d08cff769767a2294eda730"
          },
          "business_uuid": "{{businessId}}",
          "channel": "magento",
          "channel_set_uuid": "006388b0-e536-4d71-b1f1-c21a6f1801e6",
          "created_at": "2019-01-15T13:41:25.000Z",
          "currency": "EUR",
          "customer_email": "we9fhwiuhiu@gmail.com",
          "customer_name": "Stub Accepted",
          "delivery_fee": 0,
          "down_payment": 0,
          "items": [],
          "merchant_email": "sergiokurba11@gmail.com",
          "merchant_name": "TEST TRANSACTIONS",
          "payment_details": {
            "unique_id": "STUB_UNIQUE_ID",
            "usage_text": "STUB_USAGE_TEXT",
            "basket_id": "STUB_BASKET_ID",
            "advertising_accepted": true,
            "conditions_accepted": true,
            "birthday": "22.04.1978"
          },
          "payment_fee": 0,
          "payment_flow_id": "ec29696a0048b3da8f556b151652f29d",
          "place": "refunded",
          "reference": "3b864596-ca5b-429b-bfc1-4f9d5d87c375",
          "santander_applications": [],
          "specific_status": "ACCEPTED",
          "status": "STATUS_CANCELLED",
          "total": 650,
          "type": "santander_installment",
          "updated_at": "2019-01-15T13:41:26.000Z"
        }
      }
    }
    """
    Given I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
    """
    {
      "name": "checkout.event.scheduled-payment-action.run",
      "payload": {
         "schedule": {
           "_id": "{{scheduleId}}",
           "businessId": "{{businessId}}",
           "task": "payment_action",
           "duration": {
              "type": "every",
              "unit": "day",
              "period": 5
           },
           "action": "cancel",
           "paymentMethod": "santander_installment",
           "enabled": true,
           "filter": {
             "status": "STATUS_IN_PROCESS"
           }
         },
         "paymentId": "{{paymentId}}"
      }
    }
    """
    Then I process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then I look for model "Payment" by following JSON and remember as "updatedPayment":
    """
    {
      "original_id": "{{paymentId}}"
    }
    """
    Then print storage key "updatedPayment"
    Then stored value "updatedPayment" should contain json:
    """
    {
       "original_id": "{{paymentId}}",
       "status": "STATUS_CANCELLED"
    }
    """
