Feature: Payment bus message handling
  Background:
    Given I remember as "paymentUuid" following value:
      """
      "08b1d4a82ca1c65aa35ad4c85f2ac8a8"
      """
    Given I remember as "originalId" following value:
      """
      "7e3dcb4bf94bf23f6d4113e5845fe9f8"
      """
    Given I remember as "flowId" following value:
      """
      "815e412c-6881-11e7-9835-52540073a0b6"
      """
    Given I remember as "checkoutMetricsId" following value:
      """
      "65ceae0a-b810-41b9-907f-923b6f7892a1"
      """
    Given I remember as "apiCallId" following value:
      """
      "52fd5c5e-f60e-496f-9903-36125dfae971"
      """

  Scenario: Payment created event
    Given I use DB fixture "checkout-metrics/payment-bus-message/flow-metrics-exists"
    When I publish in RabbitMQ channel "async_events_checkout_analytics_app_micro" message with json:
    """
    {
      "name": "checkout.event.payment.created",
      "payload": {
        "payment": {
          "id": "{{originalId}}",
          "uuid": "{{paymentUuid}}",
          "amount": 1000,
          "delivery_fee": 0,
          "down_payment": 0,
          "total": 1000,
          "business": {
            "uuid": "business-uuid",
            "company_name": "Business name"
          },
          "channel": "pos",
          "channel_set": {
            "uuid": "channel-set-uuid"
          },
          "currency": "EUR",
          "payment_flow": {
            "id": "{{flowId}}",
            "payment_method": "santander_installment"
          },
          "payment_type": "santander_installment",
          "reference": "1234567890",
          "status": "STATUS_NEW",
          "address": {
            "city": "Berlin",
            "country": "DE",
            "country_name": "Germany",
            "street": "street 1",
            "zip_code": "1234"
          },
          "items": [],
          "created_at": "2019-12-14 14:16:09.000",
          "updated_at": "2019-12-14 14:16:09.000",
          "customer_type": "organization"
        }
      }
    }
    """
    And process messages from RabbitMQ "async_events_checkout_analytics_app_micro" channel
    Then model "Payment" with id "{{paymentUuid}}" should contain json:
    """
    {
      "_id": "{{paymentUuid}}",
      "amount": 1000,
      "billingAddress": {
        "city": "Berlin",
        "country": "DE",
        "countryName": "Germany",
        "street": "street 1",
        "zipCode": "1234"
      },
      "businessId": "business-uuid",
      "businessName": "Business name",
      "channel": "pos",
      "channelSetId": "channel-set-uuid",
      "createdAt": "*",
      "currency": "EUR",
      "customerType": "organization",
      "deliveryFee": 0,
      "downPayment": 0,
      "originalId": "{{originalId}}",
      "paymentMethod": "santander_installment",
      "reference": "1234567890",
      "status": "STATUS_NEW",
      "total": 1000,
      "updatedAt": "*"
    }
    """
    Then model "CheckoutMetrics" with id "{{checkoutMetricsId}}" should contain json:
    """
    {
      "_id": "{{checkoutMetricsId}}",
      "paymentFlowId": "{{flowId}}",
      "newPaymentId": "{{originalId}}",
      "paymentMethod": "santander_installment"
    }
    """

  Scenario: Payment created event for santander NO (need info)
    Given I use DB fixture "checkout-metrics/payment-bus-message/santander-no-flow-metrics-exists"
    When I publish in RabbitMQ channel "async_events_checkout_analytics_app_micro" message with json:
    """
    {
      "name": "checkout.event.payment.created",
      "payload": {
        "payment": {
          "id": "{{originalId}}",
          "uuid": "{{paymentUuid}}",
          "amount": 1000,
          "delivery_fee": 0,
          "down_payment": 0,
          "total": 1000,
          "business": {
            "uuid": "business-uuid",
            "company_name": "Business name"
          },
          "channel": "pos",
          "channel_set": {
            "uuid": "channel-set-uuid"
          },
          "currency": "EUR",
          "payment_flow": {
            "id": "{{flowId}}",
            "payment_method": "santander_installment_no"
          },
          "payment_type": "santander_installment_no",
          "reference": "1234567890",
          "status": "STATUS_NEW",
          "specific_status": "NEED_MORE_INFO",
          "address": {
            "city": "Berlin",
            "country": "DE",
            "country_name": "Germany",
            "street": "street 1",
            "zip_code": "1234"
          },
          "items": [],
          "created_at": "2019-12-14 14:16:09.000",
          "updated_at": "2019-12-14 14:16:09.000"
        }
      }
    }
    """
    And process messages from RabbitMQ "async_events_checkout_analytics_app_micro" channel
    Then model "CheckoutMetrics" with id "{{checkoutMetricsId}}" should contain json:
    """
    {
      "_id": "{{checkoutMetricsId}}",
      "paymentFlowId": "{{flowId}}",
      "newPaymentId": null,
      "paymentMethod": "santander_installment_no"
    }
    """
    When I publish in RabbitMQ channel "async_events_checkout_analytics_app_micro" message with json:
    """
    {
      "name": "checkout.event.payment.created",
      "payload": {
        "payment": {
          "id": "{{originalId}}",
          "uuid": "{{paymentUuid}}",
          "amount": 1000,
          "delivery_fee": 0,
          "down_payment": 0,
          "total": 1000,
          "business": {
            "uuid": "business-uuid",
            "company_name": "Business name"
          },
          "channel": "pos",
          "channel_set": {
            "uuid": "channel-set-uuid"
          },
          "currency": "EUR",
          "payment_flow": {
            "id": "{{flowId}}",
            "payment_method": "santander_installment_no"
          },
          "payment_type": "santander_installment_no",
          "reference": "1234567890",
          "status": "STATUS_NEW",
          "specific_status": "SIGNED",
          "address": {
            "city": "Berlin",
            "country": "DE",
            "country_name": "Germany",
            "street": "street 1",
            "zip_code": "1234"
          },
          "items": [],
          "created_at": "2019-12-14 14:16:09.000",
          "updated_at": "2019-12-14 14:16:09.000"
        }
      }
    }
    """
    And process messages from RabbitMQ "async_events_checkout_analytics_app_micro" channel
    Then model "CheckoutMetrics" with id "{{checkoutMetricsId}}" should contain json:
    """
    {
      "_id": "{{checkoutMetricsId}}",
      "paymentFlowId": "{{flowId}}",
      "newPaymentId": "{{originalId}}",
      "paymentMethod": "santander_installment_no"
    }
    """

  Scenario: Payment created event after direct submit
    When I publish in RabbitMQ channel "async_events_checkout_analytics_app_micro" message with json:
    """
    {
      "name": "checkout.event.payment.created",
      "payload": {
        "payment": {
          "id": "{{originalId}}",
          "uuid": "{{paymentUuid}}",
          "amount": 1000,
          "delivery_fee": 0,
          "down_payment": 0,
          "total": 1000,
          "business": {
            "uuid": "business-uuid",
            "company_name": "Business name"
          },
          "channel": "pos",
          "channel_set": {
            "uuid": "channel-set-uuid"
          },
          "currency": "EUR",
          "payment_flow": {
            "id": "N/A",
            "payment_method": "santander_installment"
          },
          "payment_type": "santander_installment",
          "reference": "1234567890",
          "status": "STATUS_NEW",
          "address": {
            "city": "Berlin",
            "country": "DE",
            "country_name": "Germany",
            "street": "street 1",
            "zip_code": "1234"
          },
          "items": [],
          "created_at": "2019-12-14 14:16:09.000",
          "updated_at": "2019-12-14 14:16:09.000",
          "api_call_id": "{{apiCallId}}"
        }
      }
    }
    """
    And process messages from RabbitMQ "async_events_checkout_analytics_app_micro" channel
    Then I look for model "CheckoutMetrics" by following JSON and remember as "checkoutMetrics":
    """
    {
      "newPaymentId": "{{originalId}}"
    }
    """
    Then print storage key "checkoutMetrics"
    Then model "CheckoutMetrics" with id "{{checkoutMetrics._id}}" should contain json:
    """
    {
      "apiCallId": "{{apiCallId}}",
      "newPaymentId": "{{originalId}}",
      "paymentMethod": "santander_installment",
      "paymentFlowId": "2421011547739125",
      "successPaymentId": null
    }
    """
    Then I publish in RabbitMQ channel "async_events_checkout_analytics_app_micro" message with json:
    """
    {
      "name": "checkout.event.payment.submitted",
      "payload": {
        "payment": {
          "id": "{{originalId}}",
          "uuid": "{{paymentUuid}}",
          "amount": 1000,
          "delivery_fee": 0,
          "down_payment": 0,
          "total": 1000,
          "business": {
            "uuid": "business-uuid",
            "company_name": "Business name"
          },
          "channel": "pos",
          "channel_set": {
            "uuid": "channel-set-uuid"
          },
          "currency": "EUR",
          "payment_flow": {
            "id": "N/A",
            "payment_method": "santander_installment"
          },
          "payment_type": "santander_installment",
          "reference": "1234567890",
          "status": "STATUS_ACCEPTED",
          "address": {
            "city": "Berlin",
            "country": "DE",
            "country_name": "Germany",
            "street": "street 1",
            "zip_code": "1234"
          },
          "items": [],
          "created_at": "2019-12-14 14:16:09.000",
          "updated_at": "2019-12-14 14:16:09.000",
          "api_call_id": "{{apiCallId}}"
        }
      }
    }
    """
    And process messages from RabbitMQ "async_events_checkout_analytics_app_micro" channel
    Then model "CheckoutMetrics" with id "{{checkoutMetrics._id}}" should contain json:
    """
    {
      "apiCallId": "{{apiCallId}}",
      "newPaymentId": "{{originalId}}",
      "paymentMethod": "santander_installment",
      "paymentFlowId": "2421011547739125",
      "successPaymentId": "{{originalId}}"
    }
    """

  Scenario: Payment submitted event
    Given I use DB fixture "checkout-metrics/payment-bus-message/flow-metrics-exists"
    When I publish in RabbitMQ channel "async_events_checkout_analytics_app_micro" message with json:
    """
    {
      "name": "checkout.event.payment.created",
      "payload": {
        "payment": {
          "id": "{{originalId}}",
          "payment_type": "santander_installment",
          "payment_flow": {
            "id": "{{flowId}}",
            "payment_method": "santander_installment"
          }
        }
      }
    }
    """
    And process messages from RabbitMQ "async_events_checkout_analytics_app_micro" channel
    Then model "CheckoutMetrics" with id "{{checkoutMetricsId}}" should contain json:
    """
    {
      "_id": "{{checkoutMetricsId}}",
      "paymentFlowId": "{{flowId}}",
      "newPaymentId": "{{originalId}}",
      "paymentMethod": "santander_installment"
    }
    """
    Then I publish in RabbitMQ channel "async_events_checkout_analytics_app_micro" message with json:
    """
    {
      "name": "checkout.event.payment.submitted",
      "payload": {
        "payment": {
          "id": "{{originalId}}",
          "payment_type": "santander_installment",
          "payment_flow": {
            "id": "{{flowId}}",
            "payment_method": "santander_installment"
          }
        }
      }
    }
    """
    And process messages from RabbitMQ "async_events_checkout_analytics_app_micro" channel
    Then model "CheckoutMetrics" with id "{{checkoutMetricsId}}" should contain json:
    """
    {
      "_id": "{{checkoutMetricsId}}",
      "paymentFlowId": "{{flowId}}",
      "newPaymentId": "{{originalId}}",
      "paymentMethod": "santander_installment",
      "successPaymentId": "{{originalId}}"
    }
    """

  Scenario: Payment submitted event for santander NO
    Given I use DB fixture "checkout-metrics/payment-bus-message/santander-no-flow-metrics-exists"
    When I publish in RabbitMQ channel "async_events_checkout_analytics_app_micro" message with json:
    """
    {
      "name": "checkout.event.payment.created",
      "payload": {
        "payment": {
          "id": "{{originalId}}",
          "payment_type": "santander_installment_no",
          "specific_status": "NEED_MORE_INFO",
          "payment_flow": {
            "id": "{{flowId}}",
            "payment_method": "santander_installment_no"
          }
        }
      }
    }
    """
    And process messages from RabbitMQ "async_events_checkout_analytics_app_micro" channel
    Then model "CheckoutMetrics" with id "{{checkoutMetricsId}}" should contain json:
    """
    {
      "_id": "{{checkoutMetricsId}}",
      "paymentFlowId": "{{flowId}}",
      "newPaymentId": null,
      "paymentMethod": "santander_installment_no"
    }
    """
    Then I publish in RabbitMQ channel "async_events_checkout_analytics_app_micro" message with json:
    """
    {
      "name": "checkout.event.payment.submitted",
      "payload": {
        "payment": {
          "id": "{{originalId}}",
          "payment_type": "santander_installment_no",
          "specific_status": "NEED_MORE_INFO",
          "payment_flow": {
            "id": "{{flowId}}",
            "payment_method": "santander_installment_no"
          }
        }
      }
    }
    """
    And process messages from RabbitMQ "async_events_checkout_analytics_app_micro" channel
    Then model "CheckoutMetrics" with id "{{checkoutMetricsId}}" should contain json:
    """
    {
      "_id": "{{checkoutMetricsId}}",
      "paymentFlowId": "{{flowId}}",
      "newPaymentId": null,
      "paymentMethod": "santander_installment_no",
      "successPaymentId": null
    }
    """
    Then I publish in RabbitMQ channel "async_events_checkout_analytics_app_micro" message with json:
    """
    {
      "name": "checkout.event.payment.submitted",
      "payload": {
        "payment": {
          "id": "{{originalId}}",
          "payment_type": "santander_installment_no",
          "specific_status": "SIGNED",
          "payment_flow": {
            "id": "{{flowId}}",
            "payment_method": "santander_installment_no"
          }
        }
      }
    }
    """
    And process messages from RabbitMQ "async_events_checkout_analytics_app_micro" channel
    Then model "CheckoutMetrics" with id "{{checkoutMetricsId}}" should contain json:
    """
    {
      "_id": "{{checkoutMetricsId}}",
      "paymentFlowId": "{{flowId}}",
      "paymentMethod": "santander_installment_no",
      "successPaymentId": "{{originalId}}"
    }
    """

  Scenario: Payment submitted event after direct submit
    When I publish in RabbitMQ channel "async_events_checkout_analytics_app_micro" message with json:
    """
    {
      "name": "checkout.event.payment.submitted",
      "payload": {
        "payment": {
          "id": "{{originalId}}",
          "uuid": "{{paymentUuid}}",
          "amount": 1000,
          "delivery_fee": 0,
          "down_payment": 0,
          "total": 1000,
          "business": {
            "uuid": "business-uuid",
            "company_name": "Business name"
          },
          "channel": "pos",
          "channel_set": {
            "uuid": "channel-set-uuid"
          },
          "currency": "EUR",
          "payment_flow": {
            "id": "N/A",
            "payment_method": "santander_installment"
          },
          "payment_type": "santander_installment",
          "reference": "1234567890",
          "status": "STATUS_ACCEPTED",
          "address": {
            "city": "Berlin",
            "country": "DE",
            "country_name": "Germany",
            "street": "street 1",
            "zip_code": "1234"
          },
          "items": [],
          "created_at": "2019-12-14 14:16:09.000",
          "updated_at": "2019-12-14 14:16:09.000",
          "api_call_id": "{{apiCallId}}"
        }
      }
    }
    """
    And process messages from RabbitMQ "async_events_checkout_analytics_app_micro" channel
    Then I look for model "CheckoutMetrics" by following JSON and remember as "checkoutMetrics":
    """
    {
      "newPaymentId": "{{originalId}}"
    }
    """
    Then print storage key "checkoutMetrics"
    Then model "CheckoutMetrics" with id "{{checkoutMetrics._id}}" should contain json:
    """
    {
      "apiCallId": "{{apiCallId}}",
      "newPaymentId": "{{originalId}}",
      "paymentMethod": "santander_installment",
      "paymentFlowId": "2421011547739125",
      "successPaymentId": "{{originalId}}"
    }
    """

  Scenario: Payment updated event
    Given I use DB fixture "checkout-metrics/payment-bus-message/payment-exists"
    When I publish in RabbitMQ channel "async_events_checkout_analytics_app_micro" message with json:
    """
    {
      "name": "checkout.event.payment.updated",
      "payload": {
        "payment": {
          "id": "{{originalId}}",
          "uuid": "{{paymentUuid}}",
          "amount": 1000,
          "delivery_fee": 0,
          "down_payment": 0,
          "total": 1000,
          "business": {
            "uuid": "business-uuid",
            "company_name": "Business name"
          },
          "channel": "pos",
          "channel_set": {
            "uuid": "channel-set-uuid"
          },
          "currency": "EUR",
          "payment_flow": {
            "id": "{{flowId}}",
            "payment_method": "santander_installment"
          },
          "payment_type": "santander_installment",
          "reference": "1234567890",
          "status": "STATUS_IN_PROCESS",
          "address": {
            "city": "Berlin",
            "country": "DE",
            "country_name": "Germany",
            "street": "street 1",
            "zip_code": "1234"
          },
          "items": [],
          "created_at": "2019-12-14 14:16:09.000",
          "updated_at": "2019-12-14 14:16:09.000"
        }
      }
    }
    """
    And process messages from RabbitMQ "async_events_checkout_analytics_app_micro" channel
    Then model "Payment" with id "{{paymentUuid}}" should contain json:
    """
    {
      "_id": "{{paymentUuid}}",
      "status": "STATUS_IN_PROCESS"
    }
    """

  Scenario: Payment removed event
    Given I use DB fixture "checkout-metrics/payment-bus-message/payment-exists"
    When I publish in RabbitMQ channel "async_events_checkout_analytics_app_micro" message with json:
    """
    {
      "name": "checkout.event.payment.removed",
      "payload": {
        "payment": {
          "uuid": "{{paymentUuid}}"
        }
      }
    }
    """
    And process messages from RabbitMQ "async_events_checkout_analytics_app_micro" channel
    Then model "Payment" with id "{{paymentUuid}}" should not exist

  Scenario: Payment migrate event, new payment
    When I publish in RabbitMQ channel "async_events_checkout_analytics_app_micro" message with json:
    """
    {
      "name": "checkout.event.payment.migrate",
      "payload": {
        "payment": {
          "id": "{{originalId}}",
          "uuid": "{{paymentUuid}}",
          "amount": 1000,
          "delivery_fee": 0,
          "down_payment": 0,
          "total": 1000,
          "business": {
            "uuid": "business-uuid",
            "company_name": "Business name"
          },
          "channel": "pos",
          "channel_set": {
            "uuid": "channel-set-uuid"
          },
          "currency": "EUR",
          "payment_flow": {
            "id": "{{flowId}}",
            "payment_method": "santander_installment"
          },
          "payment_type": "santander_installment",
          "reference": "1234567890",
          "status": "STATUS_NEW",
          "address": {
            "city": "Berlin",
            "country": "DE",
            "country_name": "Germany",
            "street": "street 1",
            "zip_code": "1234"
          },
          "items": [],
          "created_at": "2019-12-14 14:16:09.000",
          "updated_at": "2019-12-14 14:16:09.000"
        }
      }
    }
    """
    And process messages from RabbitMQ "async_events_checkout_analytics_app_micro" channel
    Then model "Payment" with id "{{paymentUuid}}" should contain json:
    """
    {
      "_id": "{{paymentUuid}}",
      "amount": 1000,
      "billingAddress": {
        "city": "Berlin",
        "country": "DE",
        "countryName": "Germany",
        "street": "street 1",
        "zipCode": "1234"
      },
      "businessId": "business-uuid",
      "businessName": "Business name",
      "channel": "pos",
      "channelSetId": "channel-set-uuid",
      "createdAt": "*",
      "currency": "EUR",
      "deliveryFee": 0,
      "downPayment": 0,
      "originalId": "{{originalId}}",
      "paymentMethod": "santander_installment",
      "reference": "1234567890",
      "status": "STATUS_NEW",
      "total": 1000,
      "updatedAt": "*"
    }
    """

  Scenario: Payment migrate event, update payment
    Given I use DB fixture "checkout-metrics/payment-bus-message/payment-exists"
    When I publish in RabbitMQ channel "async_events_checkout_analytics_app_micro" message with json:
    """
    {
      "name": "checkout.event.payment.migrate",
      "payload": {
        "payment": {
          "id": "{{originalId}}",
          "uuid": "{{paymentUuid}}",
          "amount": 1000,
          "delivery_fee": 0,
          "down_payment": 0,
          "total": 1000,
          "business": {
            "uuid": "business-uuid",
            "company_name": "Business name"
          },
          "channel": "pos",
          "channel_set": {
            "uuid": "channel-set-uuid"
          },
          "currency": "EUR",
          "payment_flow": {
            "id": "{{flowId}}",
            "payment_method": "santander_installment"
          },
          "payment_type": "santander_installment",
          "reference": "1234567890",
          "status": "STATUS_IN_PROCESS",
          "address": {
            "city": "Berlin",
            "country": "DE",
            "country_name": "Germany",
            "street": "street 1",
            "zip_code": "1234"
          },
          "items": [],
          "created_at": "2019-12-14 14:16:09.000",
          "updated_at": "2019-12-14 14:16:09.000"
        }
      }
    }
    """
    And process messages from RabbitMQ "async_events_checkout_analytics_app_micro" channel
    Then model "Payment" with id "{{paymentUuid}}" should contain json:
    """
    {
      "_id": "{{paymentUuid}}",
      "amount": 1000,
      "billingAddress": {
        "city": "Berlin",
        "country": "DE",
        "countryName": "Germany",
        "street": "street 1",
        "zipCode": "1234"
      },
      "businessId": "business-uuid",
      "businessName": "Business name",
      "channel": "pos",
      "channelSetId": "channel-set-uuid",
      "createdAt": "*",
      "currency": "EUR",
      "deliveryFee": 0,
      "downPayment": 0,
      "originalId": "{{originalId}}",
      "paymentMethod": "santander_installment",
      "reference": "1234567890",
      "status": "STATUS_IN_PROCESS",
      "total": 1000,
      "updatedAt": "*"
    }
    """

  Scenario: Payment blank migrate event
    When I publish in RabbitMQ channel "async_events_checkout_analytics_app_micro" message with json:
    """
    {
      "name": "checkout.event.payment.blank-migrate",
      "payload": {
        "payment": {
          "id": "{{originalId}}",
          "uuid": "{{paymentUuid}}",
          "amount": 1000,
          "delivery_fee": 0,
          "down_payment": 0,
          "total": 1000,
          "business": {
            "uuid": "business-uuid",
            "company_name": "Business name"
          },
          "channel": "pos",
          "channel_set": {
            "uuid": "channel-set-uuid"
          },
          "currency": "EUR",
          "payment_flow": {
            "id": "{{flowId}}",
            "payment_method": "santander_installment"
          },
          "payment_type": "santander_installment",
          "reference": "1234567890",
          "status": "STATUS_NEW",
          "address": {
            "city": "Berlin",
            "country": "DE",
            "country_name": "Germany",
            "street": "street 1",
            "zip_code": "1234"
          },
          "items": [],
          "created_at": "2019-12-14 14:16:09.000",
          "updated_at": "2019-12-14 14:16:09.000"
        }
      }
    }
    """
    And process messages from RabbitMQ "async_events_checkout_analytics_app_micro" channel
    Then model "Payment" with id "{{paymentUuid}}" should contain json:
    """
    {
      "_id": "{{paymentUuid}}",
      "amount": 1000,
      "billingAddress": {
        "city": "Berlin",
        "country": "DE",
        "countryName": "Germany",
        "street": "street 1",
        "zipCode": "1234"
      },
      "businessId": "business-uuid",
      "businessName": "Business name",
      "channel": "pos",
      "channelSetId": "channel-set-uuid",
      "createdAt": "*",
      "currency": "EUR",
      "deliveryFee": 0,
      "downPayment": 0,
      "originalId": "{{originalId}}",
      "paymentMethod": "santander_installment",
      "reference": "1234567890",
      "status": "STATUS_NEW",
      "total": 1000,
      "updatedAt": "*"
    }
    """

  Scenario: Transaction migrate event
    When I publish in RabbitMQ channel "async_events_checkout_analytics_app_micro" message with json:
    """
    {
      "name": "transactions.event.payment.migrate",
      "payload": {
        "payment": {
          "id": "{{originalId}}",
          "uuid": "{{paymentUuid}}",
          "amount": 1000,
          "delivery_fee": 0,
          "down_payment": 0,
          "total": 1000,
          "business": {
            "uuid": "business-uuid",
            "company_name": "Business name"
          },
          "channel": "pos",
          "channel_set": {
            "uuid": "channel-set-uuid"
          },
          "currency": "EUR",
          "payment_flow": {
            "id": "{{flowId}}",
            "payment_method": "santander_installment"
          },
          "payment_type": "santander_installment",
          "reference": "1234567890",
          "status": "STATUS_NEW",
          "address": {
            "city": "Berlin",
            "country": "DE",
            "country_name": "Germany",
            "street": "street 1",
            "zip_code": "1234"
          },
          "items": [],
          "created_at": "2019-12-14 14:16:09.000",
          "updated_at": "2019-12-14 14:16:09.000"
        }
      }
    }
    """
    And process messages from RabbitMQ "async_events_checkout_analytics_app_micro" channel
    Then model "Payment" with id "{{paymentUuid}}" should contain json:
    """
    {
      "_id": "{{paymentUuid}}",
      "amount": 1000,
      "billingAddress": {
        "city": "Berlin",
        "country": "DE",
        "countryName": "Germany",
        "street": "street 1",
        "zipCode": "1234"
      },
      "businessId": "business-uuid",
      "businessName": "Business name",
      "channel": "pos",
      "channelSetId": "channel-set-uuid",
      "createdAt": "*",
      "currency": "EUR",
      "deliveryFee": 0,
      "downPayment": 0,
      "originalId": "{{originalId}}",
      "paymentMethod": "santander_installment",
      "reference": "1234567890",
      "status": "STATUS_NEW",
      "total": 1000,
      "updatedAt": "*"
    }
    """

  Scenario: Transaction export payments event
    Given I use DB fixture "checkout-metrics/payment-bus-message/payment-exists"
    When I publish in RabbitMQ channel "async_events_checkout_analytics_app_micro" message with json:
      """
      {
        "name": "transactions.event.payment.export",
        "payload": {
          "amount": 444,
          "business": {
            "id": "1111111"
          },
          "channel": "111111",
          "channel_set": {
            "id": "1111111"
          },
          "date": "2019-12-14 14:16:09.000",
          "items": [],
          "reference": 2412512,
          "user": {
            "id": "1212121"
          },
          "id": "815e412c-6881-11e7-9835-52540073a0b6",
          "customer": {
            "name": "11111",
            "email": "1111@1111.111"
          }
        }
      }
      """
    And process messages from RabbitMQ "async_events_checkout_analytics_app_micro" channel
    Then model "Payment" with id "815e412c-6881-11e7-9835-52540073a0b6" should contain json:
      """
      {
        "_id": "815e412c-6881-11e7-9835-52540073a0b6",
        "customerName": "11111",
        "customerEmail": "1111@1111.111",
        "userId":"1212121"
      }
      """
