@payment-message-controller
Feature: Handle payment notification failed error
  Background:
    Given I remember as "businessId" following value:
    """
      "6111e145-fb5e-4098-ae0c-ad51ea92fa64"
    """
    Given I remember as "businessPaypalCron" following value:
    """
      "fe4f1cd0-71d9-11eb-9439-0242ac130002"
    """
    Given I remember as "businessPaypalAfter" following value:
    """
      "6d9c8963-6d4f-42df-9e95-d7a52206a63e"
    """
    Given I remember as "businessSantanderCron" following value:
    """
      "23c7752a-71da-11eb-9439-0242ac130002"
    """
    Given I remember as "businessSantanderAfter" following value:
    """
      "27b47d5e-71da-11eb-9439-0242ac130002"
    """
    Given I remember as "paymentId" following value:
    """
      "ead92ff6-f14a-4b78-809e-b9ddb046345f"
    """
  Scenario: New payment submitted event
    Given I use DB fixture "settings/business-settings"
    When I publish in RabbitMQ channel "async_events_error_notifications_micro" message with json:
    """
    {
      "name": "checkout.event.payment.submitted",
      "payload": {
        "payment": {
          "delivery_fee": 0,
          "payment_fee": 22,
          "id": "ead92ff6-f14a-4b78-809e-b9ddb046345f",
          "uuid": "{{paymentId}}",
          "amount": 750,
          "address": {
            "city": "Hamburg",
            "country": "DE",
            "country_name": "DE",
            "email": "sdsd@sdds.eu",
            "first_name": "Dmytro",
            "last_name": "Romanenko",
            "phone": "+4930901820",
            "salutation": "SALUTATION_MR",
            "street": "Feldstraße 53",
            "zip_code": "20357"
          },
          "api_call_id": "8335c100-fcf5-469f-b71e-66e1b2dc6c79",
          "business": {
            "company_name": "Stripe test",
            "id": "{{businessId}}",
            "slug": "{{businessId}}",
            "uuid": "{{businessId}}"
          },
          "channel": "api",
          "created_at": "2021-09-20T09:49:36+00:00",
          "currency": "EUR",
          "customer_email": "sdsd@sdds.eu",
          "customer_name": "Dmytro Romanenko",
          "down_payment": 0,
          "payment_flow": {
            "id": "d9429753bf0f92367499fcc142581646"
          },
          "payment_type": "paypal",
          "reference": "sa45s454as3999123432111",
          "shipping_address": null,
          "specific_status": "succeeded",
          "status": "STATUS_ACCEPTED",
          "total": 772,
          "updated_at": "2021-09-20T09:49:36+00:00",
          "history": [],
          "items": [ ],
          "payment_details": {
            "postback_url": "https://checkout.test.devpayever.com/pay/d9429753bf0f92367499fcc142581646/stripe-postback",
            "token_id": "tok_1Jbj80ENh16ld2JUhT0MxAno",
            "card_last_4_digits": "4242",
            "charge_id": "pi_3Jbj82ENh16ld2JU0Wsk0Drc",
            "customer_id": "cus_KGFd2kkUBjopBD"
          },
          "captured_items": [],
          "refunded_items": []
        }
      }
    }
    """
    And process messages from RabbitMQ "async_events_error_notifications_micro" channel
    Then look for model "ErrorNotification" by following JSON and remember as "error_notification":
    """
    {
      "businessId": "{{businessId}}"
    }
    """
    Then print storage key "error_notification"
    And model "ErrorNotification" with id "{{error_notification._id}}" should contain json:
    """
    {
      "_id": "{{error_notification._id}}",
      "businessId": "{{businessId}}",
      "integration": "paypal",
      "errorDate": "2021-09-20T09:49:36.000Z",
      "type": "last-transaction-time",
      "createdAt": "*",
      "updatedAt": "*"
    }
    """

    Then look for model "Transaction" by following JSON and remember as "transaction":
    """
    {
      "_id": "{{paymentId}}"
    }
    """
    Then print storage key "transaction"
    And model "Transaction" with id "{{transaction._id}}" should contain json:
    """
    {
      "_id": "{{transaction._id}}",
      "businessId": "{{businessId}}",
      "paymentType": "paypal",
      "status": "STATUS_ACCEPTED",
      "updatedAt": "*"
    }
    """

  Scenario: Update last transaction time event
    Given I use DB fixture "error-notifications-update-test"
    Given I use DB fixture "settings/business-settings"
    When I publish in RabbitMQ channel "async_events_error_notifications_micro" message with json:
    """
    {
      "name": "checkout.event.payment.submitted",
      "payload": {
        "payment": {
          "delivery_fee": 0,
          "payment_fee": 22,
          "id": "ead92ff6-f14a-4b78-809e-b9ddb046345f",
          "uuid": "{{paymentId}}",
          "amount": 750,
          "address": {
            "city": "Hamburg",
            "country": "DE",
            "country_name": "DE",
            "email": "sdsd@sdds.eu",
            "first_name": "Dmytro",
            "last_name": "Romanenko",
            "phone": "+4930901820",
            "salutation": "SALUTATION_MR",
            "street": "Feldstraße 53",
            "zip_code": "20357"
          },
          "api_call_id": "8335c100-fcf5-469f-b71e-66e1b2dc6c79",
          "business": {
            "company_name": "Stripe test",
            "id": "{{businessId}}",
            "slug": "{{businessId}}",
            "uuid": "{{businessId}}"
          },
          "channel": "api",
          "created_at": "2021-02-09T11:00:00+00:00",
          "currency": "EUR",
          "customer_email": "sdsd@sdds.eu",
          "customer_name": "Dmytro Romanenko",
          "down_payment": 0,
          "payment_flow": {
            "id": "d9429753bf0f92367499fcc142581646"
          },
          "payment_type": "paypal",
          "reference": "sa45s454as3999123432111",
          "shipping_address": null,
          "specific_status": "succeeded",
          "status": "STATUS_ACCEPTED",
          "total": 772,
          "updated_at": "2021-02-09T11:00:00+00:00",
          "history": [],
          "items": [ ],
          "payment_details": {
            "postback_url": "https://checkout.test.devpayever.com/pay/d9429753bf0f92367499fcc142581646/stripe-postback",
            "token_id": "tok_1Jbj80ENh16ld2JUhT0MxAno",
            "card_last_4_digits": "4242",
            "charge_id": "pi_3Jbj82ENh16ld2JU0Wsk0Drc",
            "customer_id": "cus_KGFd2kkUBjopBD"
          },
          "captured_items": [],
          "refunded_items": []
        }
      }
    }
    """
    And process messages from RabbitMQ "async_events_error_notifications_micro" channel
    Then look for model "ErrorNotification" by following JSON and remember as "error_notification":
    """
    {
      "_id": "498309a9-e256-4ec1-9088-bdeabd107f33"
    }
    """
    Then print storage key "error_notification"
    And model "ErrorNotification" with id "498309a9-e256-4ec1-9088-bdeabd107f33" should contain json:
    """
    {
      "_id": "498309a9-e256-4ec1-9088-bdeabd107f33",
      "businessId": "{{businessId}}",
      "integration": "paypal",
      "errorDate": "2021-02-09T11:00:00.000Z",
      "errorDetails": { },
      "type": "last-transaction-time",
      "createdAt": "*",
      "updatedAt": "*"
    }
    """

  Scenario: Payment updated event
    Given I use DB fixture "settings/business-settings"
    Given I use DB fixture "transactions"
    When I publish in RabbitMQ channel "async_events_error_notifications_micro" message with json:
    """
    {
      "name": "checkout.event.payment.updated",
      "payload": {
        "payment": {
          "delivery_fee": 0,
          "payment_fee": 22,
          "id": "ead92ff6-f14a-4b78-809e-b9ddb046345f",
          "uuid": "{{paymentId}}",
          "amount": 750,
          "address": {
            "city": "Hamburg",
            "country": "DE",
            "country_name": "DE",
            "email": "sdsd@sdds.eu",
            "first_name": "Dmytro",
            "last_name": "Romanenko",
            "phone": "+4930901820",
            "salutation": "SALUTATION_MR",
            "street": "Feldstraße 53",
            "zip_code": "20357"
          },
          "api_call_id": "8335c100-fcf5-469f-b71e-66e1b2dc6c79",
          "business": {
            "company_name": "Stripe test",
            "id": "{{businessId}}",
            "slug": "{{businessId}}",
            "uuid": "{{businessId}}"
          },
          "channel": "api",
          "created_at": "2021-09-20T09:49:36+00:00",
          "currency": "EUR",
          "customer_email": "sdsd@sdds.eu",
          "customer_name": "Dmytro Romanenko",
          "down_payment": 0,
          "payment_flow": {
            "id": "d9429753bf0f92367499fcc142581646"
          },
          "payment_type": "paypal",
          "reference": "sa45s454as3999123432111",
          "shipping_address": null,
          "specific_status": "succeeded",
          "status": "STATUS_PAID",
          "total": 772,
          "updated_at": "2021-09-20T09:49:36+00:00",
          "history": [],
          "items": [ ],
          "payment_details": {
            "postback_url": "https://checkout.test.devpayever.com/pay/d9429753bf0f92367499fcc142581646/stripe-postback",
            "token_id": "tok_1Jbj80ENh16ld2JUhT0MxAno",
            "card_last_4_digits": "4242",
            "charge_id": "pi_3Jbj82ENh16ld2JU0Wsk0Drc",
            "customer_id": "cus_KGFd2kkUBjopBD"
          },
          "captured_items": [],
          "refunded_items": []
        }
      }
    }
    """
    And process messages from RabbitMQ "async_events_error_notifications_micro" channel
    Then look for model "Transaction" by following JSON and remember as "transaction":
    """
    {
      "_id": "{{paymentId}}"
    }
    """
    Then print storage key "transaction"
    And model "Transaction" with id "{{transaction._id}}" should contain json:
    """
    {
      "_id": "{{transaction._id}}",
      "businessId": "{{businessId}}",
      "paymentType": "paypal",
      "status": "STATUS_PAID",
      "updatedAt": "*"
    }
    """

  Scenario: Payment removed event
    Given I use DB fixture "settings/business-settings"
    Given I use DB fixture "transactions"
    When I publish in RabbitMQ channel "async_events_error_notifications_micro" message with json:
    """
    {
      "name": "checkout.event.payment.removed",
      "payload": {
        "payment": {
          "uuid": "{{paymentId}}"
        }
      }
    }
    """
    And process messages from RabbitMQ "async_events_error_notifications_micro" channel
    And model "Transaction" with id "{{paymentId}}" should not exist
