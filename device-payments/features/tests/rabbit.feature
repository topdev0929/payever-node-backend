Feature: Rabbit events controller
  Background:
    Given I remember as "businessId" following value:
      """
      "32061e24-2ce2-45b0-a431-da36457a0887"
      """
  Scenario: Payment created event
    Given I use DB fixture "businesses"
    And I use DB fixture "checkouts"
    And I use DB fixture "applications"
    And I use DB fixture "codes"

    When I publish in RabbitMQ channel "async_events_device_payments_micro" message with json:
    """
    {
      "name": "checkout.event.payment.created",
      "payload": {
        "payment": {
          "id": "cf5de7394ecf2cd774fce5470a24986b",
          "uuid": "a0e88103-12f3-45be-ac12-ea2637c7b292",
          "total": 570,
          "payment_type": "santander_installment",
          "payment_flow": {
            "id": "f74a39e21811682c89eedf64df58a7bc"
          },
          "address": {
            "phone": "+1234567890",
            "first_name": "Rob",
            "last_name": "Intveld",
            "email": "test@example.com",
            "country": "DE",
            "city": "London",
            "zip_code": 12345,
            "street": "221b, Baker street"
          }
        }
      }
    }
    """

    Then I process messages from RabbitMQ "async_events_device_payments_micro" channel
    And I look for model "PaymentCode" by following JSON and remember as "paymentCode":
    """
    {
      "flow.id": "f74a39e21811682c89eedf64df58a7bc"
    }
    """
    And stored value "paymentCode" should contain json:
    """
      {
         "_id": "d9793a20-9bdd-4140-9d33-9b3e208f20e2",
         "code": 123456,
         "applicationId": "2abc895c-8f6e-4bf8-86e9-c66e6a1fc233",
         "checkoutId": "0c6264e6-c978-4769-8c62-626fe949a4f2",
         "status": "STATUS_ACCEPTED",

         "flow": {
           "id": "f74a39e21811682c89eedf64df58a7bc",
           "amount": 570,
           "businessId": "21e67ee2-d516-42e6-9645-46765eadd0ac",
           "channelSetId": "5eab0f55-e055-4b1c-9772-96f7d11a7f3d",
           "payment": {
             "id": "cf5de7394ecf2cd774fce5470a24986b",
             "uuid": "a0e88103-12f3-45be-ac12-ea2637c7b292",
             "paymentType": "santander_installment"
           },
           "billingAddress": {
             "phone": "+79528224321",
             "firstName": "Rob",
             "lastName": "Intveld",
             "email": "test@example.com",
             "country": "DE",
             "city": "London",
             "zipCode": 12345,
             "street": "221b, Baker street"
           }
         },
         "log": {
           "secondFactor": false,
           "verificationStep": "initialization",
           "verificationType": 0,
           "source": 1,
           "paymentFlows": []
         },
         "createdAt": "*",
         "updatedAt": "*"
      }
    """

    When I publish in RabbitMQ channel "async_events_device_payments_micro" message with json:
    """
    {
      "name": "checkout.event.payment.updated",
      "payload": {
        "payment": {
          "id": "cf5de7394ecf2cd774fce5470a24986b",
          "uuid": "a0e88103-12f3-45be-ac12-ea2637c7b292",
          "total": 600,
          "payment_type": "santander_installment",
          "payment_flow": {
            "id": "f74a39e21811682c89eedf64df58a7bc"
          },
          "address": {
            "phone": "+1234567890",
            "first_name": "Rob",
            "last_name": "Intveld",
            "email": "test@example.com",
            "country": "DE",
            "city": "London",
            "zip_code": 12345,
            "street": "221b, Baker street"
          }
        }
      }
    }
    """

    Then I process messages from RabbitMQ "async_events_device_payments_micro" channel
    And I look for model "PaymentCode" by following JSON and remember as "paymentCode":
    """
    {
      "flow.id": "f74a39e21811682c89eedf64df58a7bc"
    }
    """
    And stored value "paymentCode" should contain json:
    """
      {
         "_id": "d9793a20-9bdd-4140-9d33-9b3e208f20e2",
         "code": 123456,
         "applicationId": "2abc895c-8f6e-4bf8-86e9-c66e6a1fc233",
         "checkoutId": "0c6264e6-c978-4769-8c62-626fe949a4f2",
         "status": "STATUS_ACCEPTED",

         "flow": {
           "id": "f74a39e21811682c89eedf64df58a7bc",
           "amount": 600,
           "businessId": "21e67ee2-d516-42e6-9645-46765eadd0ac",
           "channelSetId": "5eab0f55-e055-4b1c-9772-96f7d11a7f3d",
           "payment": {
             "id": "cf5de7394ecf2cd774fce5470a24986b",
             "uuid": "a0e88103-12f3-45be-ac12-ea2637c7b292",
             "paymentType": "santander_installment"
           },
           "billingAddress": {
             "phone": "+79528224321",
             "firstName": "Rob",
             "lastName": "Intveld",
             "email": "test@example.com",
             "country": "DE",
             "city": "London",
             "zipCode": 12345,
             "street": "221b, Baker street"
           }
         },
         "log": {
           "secondFactor": false,
           "verificationStep": "initialization",
           "verificationType": 0,
           "source": 1,
           "paymentFlows": []
         },
         "createdAt": "*",
         "updatedAt": "*"
      }
    """

  Scenario: Checkout linked event
    Given I use DB fixture "applications"

    When I publish in RabbitMQ channel "async_events_device_payments_micro" message with json:
    """
    {
      "name": "checkout.event.checkout.channel-set-linked",
      "payload": {
        "channelSetId": "7013667a-2344-4bb5-bc1f-fa10eae21c91",
        "checkoutId": "b70da976-e52b-46ed-972c-529045e3902a"
      }
    }
    """

    Then I process messages from RabbitMQ "async_events_device_payments_micro" channel
    And I look for model "Application" by following JSON and remember as "application":
    """
    {
      "channelSetId": "7013667a-2344-4bb5-bc1f-fa10eae21c91"
    }
    """
    And stored value "application" should contain json:
    """
    {
      "checkout": "b70da976-e52b-46ed-972c-529045e3902a"
    }
    """

  Scenario: Device payments enabled
    When I publish in RabbitMQ channel "async_events_device_payments_micro" message with json:
    """
    {
      "name": "connect.event.third-party.enabled",
      "payload": {
        "name": "device-payments",
        "category": "communications",
        "businessId": "fc0b5db7-1869-40ff-bc9b-3dafbf7fde4e"
      }
    }
    """

    Then I process messages from RabbitMQ "async_events_device_payments_micro" channel
    And I look for model "Business" by following JSON and remember as "business":
    """
    {
      "businessId": "fc0b5db7-1869-40ff-bc9b-3dafbf7fde4e"
    }
    """
    And stored value "business" should contain json:
    """
    {
      "settings": {
        "enabled": true
      }
    }
    """


  Scenario: Device payments disabled
    When I publish in RabbitMQ channel "async_events_device_payments_micro" message with json:
    """
    {
      "name": "connect.event.third-party.disabled",
      "payload": {
        "name": "device-payments",
        "category": "communications",
        "businessId": "fc0b5db7-1869-40ff-bc9b-3dafbf7fde4e"
      }
    }
    """

    Then I process messages from RabbitMQ "async_events_device_payments_micro" channel
    And I look for model "Business" by following JSON and remember as "business":
    """
    {
      "businessId": "fc0b5db7-1869-40ff-bc9b-3dafbf7fde4e"
    }
    """
    And stored value "business" should contain json:
    """
    {
      "settings": {
        "enabled": false
      }
    }
    """


  Scenario: Checkout settings updated
    Given I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "post",
        "url": "https://communications-third-party.*/api/business/21e67ee2-d516-42e6-9645-46765eadd0ac/integration/twilio/action/inbound-setup"
      },
      "response": {
        "status": 200,
        "body": "{\"phone\": \"+123456\"}"
      }
    }
    """
    And I use DB fixture "businesses"
    And I use DB fixture "checkouts"
    And I use DB fixture "applications"

    When I publish in RabbitMQ channel "async_events_device_payments_micro" message with json:
    """
    {
      "name": "checkout.event.checkout.created",
      "payload": {
        "checkoutId": "bf62b5a8-9687-4f62-acd0-398722a81d9c",
        "settings": {
          "keyword": "test keyword",
          "message": "test message",
          "phoneNumber": "+123456"
        }
      }
    }
    """

    Then I process messages from RabbitMQ "async_events_device_payments_micro" channel
    And model "Checkout" with id "bf62b5a8-9687-4f62-acd0-398722a81d9c" should contain json:
    """
    {
      "keyword": "test keyword",
      "message": "test message",
      "phoneNumber": "123456"
    }
    """

    When I publish in RabbitMQ channel "async_events_device_payments_micro" message with json:
    """
    {
      "name": "checkout.event.checkout.updated",
      "payload": {
        "checkoutId": "bf62b5a8-9687-4f62-acd0-398722a81d9c",
        "settings": {
          "keyword": "test keyword",
          "message": "test message",
          "phoneNumber": "+123458"
        }
      }
    }
    """

    Then I process messages from RabbitMQ "async_events_device_payments_micro" channel
    And model "Checkout" with id "bf62b5a8-9687-4f62-acd0-398722a81d9c" should contain json:
    """
    {
      "keyword": "test keyword",
      "message": "test message",
      "phoneNumber": "123458"
    }
    """

  Scenario: Business created event and removed event
    When I publish in RabbitMQ channel "async_events_device_payments_micro" message with json:
    """
    {
      "name": "users.event.business.created",
      "payload": {
        "_id": "{{businessId}}"
      }
    }
    """
    And I process messages from RabbitMQ "async_events_device_payments_micro" channel

    And I look for model "Business" by following JSON and remember as "business":
    """
    { "_id": "{{businessId}}" }
    """
    And stored value "business" should contain json:
    """
    { "_id": "{{businessId}}" }
    """
    When I publish in RabbitMQ channel "async_events_device_payments_micro" message with json:
    """
    {
      "name": "users.event.business.removed",
      "payload": {
        "_id": "{{businessId}}"
      }
    }
    """
    And I process messages from RabbitMQ "async_events_device_payments_micro" channel

    And model "Business" found by following JSON should not exist:
    """
    {"_id": "{{businessId}}"}
    """
