Feature: Handle payment bus message events
  Scenario: Payment created event
    Given I remember as "paymentId" following value:
    """
    "a42a90bd-a36e-45af-8a16-0cde3eb2cb75"
    """
    Given I remember as "apiCallId" following value:
    """
    "88879e63-d3a8-4547-8d3d-7797dc217bd0"
    """
    Given I use DB fixture "payment-bus-message/create/api-call-without-payment"
    When I publish in RabbitMQ channel "async_events_payment_notifications_micro" message with json:
    """
    {
      "name": "checkout.event.payment.created",
      "payload": {
        "payment": {
          "delivery_fee": 0,
          "payment_fee": 0,
          "id": "{{paymentId}}",
          "uuid": "{{paymentId}}",
          "amount": 1000,
          "address": {
            "city": "dfdsf",
            "country": "DE",
            "country_name": "DE",
            "email": "sadas@assa.md",
            "first_name": "Test",
            "last_name": "Test",
            "phone": "123456789",
            "salutation": "SALUTATION_MR",
            "street": "ssdfdsf",
            "zip_code": "12345"
          },
          "api_call_id": "{{apiCallId}}",
          "business": {
            "company_name": "Test",
            "id": "123456",
            "slug": "123456",
            "uuid": "123456"
          },
          "channel": "api",
          "created_at": "2020-03-05T10:53:23+00:00",
          "currency": "EUR",
          "customer_email": "asas@asas.md",
          "customer_name": "Test Test",
          "down_payment": 0,
          "payment_type": "instant_payment",
          "reference": "asdasdasd",
          "specific_status": null,
          "status": "STATUS_NEW",
          "total": 1000,
          "updated_at": "2020-03-05T10:53:23+00:00",
          "items": [],
          "payment_details": {
            "adsAgreement": false,
            "recipientHolder": "MyCompany Inc.",
            "recipientIban": "DE04888888880087654321",
            "senderHolder": "Testbank",
            "senderIban": "DE93888888880043218765"
          }
        }
      }
    }
    """
    And process messages from RabbitMQ "async_events_payment_notifications_micro" channel
    Then model "ApiCall" with id "{{apiCallId}}" should contain json:
    """
    {
      "_id": "{{apiCallId}}",
      "paymentId": "{{paymentId}}"
    }
    """
    And I look for model "Notification" by following JSON and remember as "notification":
    """
    {
      "paymentId": "{{paymentId}}"
    }
    """
    Then model "Notification" with id "{{notification._id}}" should contain json:
    """
    {
      "_id": "{{notification._id}}",
      "deliveryAttempts": [],
      "retriesNumber": 0,
      "apiCallId": "{{apiCallId}}",
      "message": "{\"created_at\":\"*\",\"data\":{\"payment\":{\"id\":\"{{paymentId}}\",\"amount\":1000,\"address\":{\"city\":\"dfdsf\",\"country\":\"DE\",\"email\":\"sadas@assa.md\",\"first_name\":\"Test\",\"last_name\":\"Test\",\"phone\":\"123456789\",\"salutation\":\"SALUTATION_MR\",\"street\":\"ssdfdsf\",\"zip_code\":\"12345\"},\"channel\":\"api\",\"created_at\":\"2020-03-05T10:53:23+00:00\",\"currency\":\"EUR\",\"customer_email\":\"asas@asas.md\",\"customer_name\":\"Test Test\",\"delivery_fee\":0,\"down_payment\":0,\"merchant_name\":\"Test\",\"payment_details\":{\"adsAgreement\":false,\"recipientHolder\":\"MyCompany Inc.\",\"recipientIban\":\"DE04888888880087654321\",\"senderHolder\":\"Testbank\",\"senderIban\":\"DE93888888880043218765\"},\"payment_details_array\":{\"adsAgreement\":false,\"recipientHolder\":\"MyCompany Inc.\",\"recipientIban\":\"DE04888888880087654321\",\"senderHolder\":\"Testbank\",\"senderIban\":\"DE93888888880043218765\"},\"payment_fee\":0,\"payment_type\":\"instant_payment\",\"reference\":\"asdasdasd\",\"specific_status\":null,\"status\":\"STATUS_NEW\",\"total\":1000,\"updated_at\":\"2020-03-05T10:53:23+00:00\"}},\"notification_type\":\"payment.created\"}",
      "paymentId": "{{paymentId}}",
      "status": "processing",
      "url": "https://notice.url?api_call_id={{apiCallId}}&payment_id={{paymentId}}"
    }
    """

  Scenario: Force create notification event
    Given I remember as "paymentId" following value:
    """
    "a42a90bd-a36e-45af-8a16-0cde3eb2cb75"
    """
    Given I remember as "apiCallId" following value:
    """
    "88879e63-d3a8-4547-8d3d-7797dc217bd0"
    """
    Given I use DB fixture "payment-bus-message/create/api-call-without-payment"
    When I publish in RabbitMQ channel "async_events_payment_notifications_micro" message with json:
    """
    {
      "name": "integration.event.payment.create-notification",
      "payload": {
        "payment": {
          "delivery_fee": 0,
          "payment_fee": 0,
          "id": "{{paymentId}}",
          "uuid": "{{paymentId}}",
          "amount": 1000,
          "address": {
            "city": "dfdsf",
            "country": "DE",
            "country_name": "DE",
            "email": "sadas@assa.md",
            "first_name": "Test",
            "last_name": "Test",
            "phone": "123456789",
            "salutation": "SALUTATION_MR",
            "street": "ssdfdsf",
            "zip_code": "12345"
          },
          "api_call_id": "{{apiCallId}}",
          "business": {
            "company_name": "Test",
            "id": "123456",
            "slug": "123456",
            "uuid": "123456"
          },
          "channel": "api",
          "created_at": "2020-03-05T10:53:23+00:00",
          "currency": "EUR",
          "customer_email": "asas@asas.md",
          "customer_name": "Test Test",
          "down_payment": 0,
          "payment_type": "instant_payment",
          "reference": "asdasdasd",
          "specific_status": null,
          "status": "STATUS_IN_PROCESS",
          "total": 1000,
          "updated_at": "2020-03-05T10:53:24+00:00",
          "items": [],
          "payment_details": {
            "adsAgreement": false,
            "recipientHolder": "MyCompany Inc.",
            "recipientIban": "DE04888888880087654321",
            "senderHolder": "Testbank",
            "senderIban": "DE93888888880043218765",
            "wizardSessionKey": "lBIfdFgEz9UXTIYU8nt2IZmMu0srIdGSXWPI5hC3",
            "transactionId": "11348-xp-CYiB-tY44"
          }
        }
      }
    }
    """
    And process messages from RabbitMQ "async_events_payment_notifications_micro" channel
    Then model "ApiCall" with id "{{apiCallId}}" should contain json:
    """
    {
      "_id": "{{apiCallId}}",
      "paymentId": "{{paymentId}}"
    }
    """
    And I look for model "Notification" by following JSON and remember as "notification":
    """
    {
      "paymentId": "{{paymentId}}"
    }
    """
    Then model "Notification" with id "{{notification._id}}" should contain json:
    """
    {
      "_id": "{{notification._id}}",
      "deliveryAttempts": [],
      "retriesNumber": 0,
      "apiCallId": "{{apiCallId}}",
      "message": "{\"created_at\":\"*\",\"data\":{\"payment\":{\"id\":\"{{paymentId}}\",\"amount\":1000,\"address\":{\"city\":\"dfdsf\",\"country\":\"DE\",\"email\":\"sadas@assa.md\",\"first_name\":\"Test\",\"last_name\":\"Test\",\"phone\":\"123456789\",\"salutation\":\"SALUTATION_MR\",\"street\":\"ssdfdsf\",\"zip_code\":\"12345\"},\"channel\":\"api\",\"created_at\":\"2020-03-05T10:53:23+00:00\",\"currency\":\"EUR\",\"customer_email\":\"asas@asas.md\",\"customer_name\":\"Test Test\",\"delivery_fee\":0,\"down_payment\":0,\"merchant_name\":\"Test\",\"payment_details\":{\"adsAgreement\":false,\"recipientHolder\":\"MyCompany Inc.\",\"recipientIban\":\"DE04888888880087654321\",\"senderHolder\":\"Testbank\",\"senderIban\":\"DE93888888880043218765\",\"wizardSessionKey\":\"lBIfdFgEz9UXTIYU8nt2IZmMu0srIdGSXWPI5hC3\",\"transactionId\":\"11348-xp-CYiB-tY44\"},\"payment_details_array\":{\"adsAgreement\":false,\"recipientHolder\":\"MyCompany Inc.\",\"recipientIban\":\"DE04888888880087654321\",\"senderHolder\":\"Testbank\",\"senderIban\":\"DE93888888880043218765\",\"wizardSessionKey\":\"lBIfdFgEz9UXTIYU8nt2IZmMu0srIdGSXWPI5hC3\",\"transactionId\":\"11348-xp-CYiB-tY44\"},\"payment_fee\":0,\"payment_type\":\"instant_payment\",\"reference\":\"asdasdasd\",\"specific_status\":null,\"status\":\"STATUS_IN_PROCESS\",\"total\":1000,\"updated_at\":\"2020-03-05T10:53:24+00:00\"}},\"notification_type\":\"payment.changed\"}",
      "paymentId": "{{paymentId}}",
      "status": "processing",
      "url": "https://notice.url?api_call_id={{apiCallId}}&payment_id={{paymentId}}"
    }
    """

  Scenario: Payment updated event with partial capture amount
    Given I remember as "paymentId" following value:
    """
    "a42a90bd-a36e-45af-8a16-0cde3eb2cb75"
    """
    Given I remember as "apiCallId" following value:
    """
    "88879e63-d3a8-4547-8d3d-7797dc217bd0"
    """
    Given I use DB fixture "payment-bus-message/create/api-call-without-payment"
    When I publish in RabbitMQ channel "async_events_payment_notifications_micro" message with json:
    """
    {
      "name": "integration.event.payment.create-notification",
      "payload": {
        "action": "shipping_goods",
        "amount": 200,
        "payment": {
          "delivery_fee": 0,
          "payment_fee": 29.25,
          "id": "{{paymentId}}",
          "uuid": "{{paymentId}}",
          "amount": 1000,
          "address": {
            "city": "dfdsf",
            "country": "DE",
            "country_name": "DE",
            "email": "sadas@assa.md",
            "first_name": "Test",
            "last_name": "Test",
            "phone": "123456789",
            "salutation": "SALUTATION_MR",
            "street": "ssdfdsf",
            "zip_code": "12345"
          },
          "api_call_id": "{{apiCallId}}",
          "business": {
            "company_name": "Test",
            "id": "123456",
            "slug": "123456",
            "uuid": "123456"
          },
          "channel": "api",
          "created_at": "2020-03-05T10:53:23+00:00",
          "currency": "EUR",
          "customer_email": "asas@asas.md",
          "customer_name": "Test Test",
          "down_payment": 0,
          "payment_type": "instant_payment",
          "reference": "asdasdasd",
          "specific_status": null,
          "status": "STATUS_REFUNDED",
          "total": 1029.25,
          "updated_at": "2020-03-05T10:53:24+00:00",
          "items": [],
          "history": [
            {
              "action": "statuschanged",
              "amount": 1029.25,
              "payment_status": "STATUS_ACCEPTED",
              "created_at": "2022-07-12T10:31:29+00:00"
            },
            {
              "action": "capture",
              "amount": 1029.25,
              "payment_status": "STATUS_ACCEPTED",
              "created_at": "2022-07-12T10:31:29+00:00"
            },
            {
              "action": "refund",
              "amount": 250,
              "payment_status": "STATUS_REFUNDED",
              "created_at": "2022-07-12T10:32:13+00:00"
            },
            {
              "action": "statuschanged",
              "amount": 1029.25,
              "payment_status": "STATUS_REFUNDED",
              "created_at": "2022-07-12T10:32:13+00:00"
            },
            {
              "action": "refund",
              "amount": 150,
              "payment_status": "STATUS_REFUNDED",
              "created_at": "2022-07-12T10:32:27+00:00"
            }
          ],
            "payment_details": {
            "adsAgreement": false,
            "recipientHolder": "MyCompany Inc.",
            "recipientIban": "DE04888888880087654321",
            "senderHolder": "Testbank",
            "senderIban": "DE93888888880043218765",
            "wizardSessionKey": "lBIfdFgEz9UXTIYU8nt2IZmMu0srIdGSXWPI5hC3",
            "transactionId": "11348-xp-CYiB-tY44"
          }
        }
      }
    }
    """
    And process messages from RabbitMQ "async_events_payment_notifications_micro" channel
    Then model "ApiCall" with id "{{apiCallId}}" should contain json:
    """
    {
      "_id": "{{apiCallId}}",
      "paymentId": "{{paymentId}}"
    }
    """
    And I look for model "Notification" by following JSON and remember as "notification":
    """
    {
      "paymentId": "{{paymentId}}"
    }
    """
    Then print storage key "notification"
    Then model "Notification" with id "{{notification._id}}" should contain json:
    """
    {
      "_id": "{{notification._id}}",
      "deliveryAttempts": [],
      "retriesNumber": 0,
      "apiCallId": "{{apiCallId}}",
      "message": "{\"created_at\":\"*\",\"data\":{\"payment\":{\"id\":\"a42a90bd-a36e-45af-8a16-0cde3eb2cb75\",\"amount\":1000,\"address\":{\"city\":\"dfdsf\",\"country\":\"DE\",\"email\":\"sadas@assa.md\",\"first_name\":\"Test\",\"last_name\":\"Test\",\"phone\":\"123456789\",\"salutation\":\"SALUTATION_MR\",\"street\":\"ssdfdsf\",\"zip_code\":\"12345\"},\"channel\":\"api\",\"created_at\":\"2020-03-05T10:53:23+00:00\",\"currency\":\"EUR\",\"customer_email\":\"asas@asas.md\",\"customer_name\":\"Test Test\",\"delivery_fee\":0,\"down_payment\":0,\"merchant_name\":\"Test\",\"payment_details\":{\"adsAgreement\":false,\"recipientHolder\":\"MyCompany Inc.\",\"recipientIban\":\"DE04888888880087654321\",\"senderHolder\":\"Testbank\",\"senderIban\":\"DE93888888880043218765\",\"wizardSessionKey\":\"lBIfdFgEz9UXTIYU8nt2IZmMu0srIdGSXWPI5hC3\",\"transactionId\":\"11348-xp-CYiB-tY44\"},\"payment_details_array\":{\"adsAgreement\":false,\"recipientHolder\":\"MyCompany Inc.\",\"recipientIban\":\"DE04888888880087654321\",\"senderHolder\":\"Testbank\",\"senderIban\":\"DE93888888880043218765\",\"wizardSessionKey\":\"lBIfdFgEz9UXTIYU8nt2IZmMu0srIdGSXWPI5hC3\",\"transactionId\":\"11348-xp-CYiB-tY44\"},\"payment_fee\":29.25,\"payment_type\":\"instant_payment\",\"reference\":\"asdasdasd\",\"specific_status\":null,\"status\":\"STATUS_REFUNDED\",\"total\":1029.25,\"updated_at\":\"2020-03-05T10:53:24+00:00\",\"capture_amount\":200},\"action\":{\"amount\":200,\"type\":\"shipping_goods\"}},\"notification_type\":\"payment.changed\"}",
      "paymentId": "{{paymentId}}",
      "status": "processing",
      "url": "https://notice.url?api_call_id={{apiCallId}}&payment_id={{paymentId}}"
    }
    """

  Scenario: Payment updated event with partial refund amount
    Given I remember as "paymentId" following value:
    """
    "a42a90bd-a36e-45af-8a16-0cde3eb2cb75"
    """
    Given I remember as "apiCallId" following value:
    """
    "88879e63-d3a8-4547-8d3d-7797dc217bd0"
    """
    Given I use DB fixture "payment-bus-message/create/api-call-without-payment"
    When I publish in RabbitMQ channel "async_events_payment_notifications_micro" message with json:
    """
    {
      "name": "integration.event.payment.create-notification",
      "payload": {
        "action": "refund",
        "amount": 200,
        "payment": {
          "delivery_fee": 0,
          "payment_fee": 29.25,
          "id": "{{paymentId}}",
          "uuid": "{{paymentId}}",
          "amount": 1000,
          "address": {
            "city": "dfdsf",
            "country": "DE",
            "country_name": "DE",
            "email": "sadas@assa.md",
            "first_name": "Test",
            "last_name": "Test",
            "phone": "123456789",
            "salutation": "SALUTATION_MR",
            "street": "ssdfdsf",
            "zip_code": "12345"
          },
          "api_call_id": "{{apiCallId}}",
          "business": {
            "company_name": "Test",
            "id": "123456",
            "slug": "123456",
            "uuid": "123456"
          },
          "channel": "api",
          "created_at": "2020-03-05T10:53:23+00:00",
          "currency": "EUR",
          "customer_email": "asas@asas.md",
          "customer_name": "Test Test",
          "down_payment": 0,
          "payment_type": "instant_payment",
          "reference": "asdasdasd",
          "specific_status": null,
          "status": "STATUS_REFUNDED",
          "total": 1029.25,
          "updated_at": "2020-03-05T10:53:24+00:00",
          "items": [],
          "history": [
            {
              "action": "statuschanged",
              "amount": 1029.25,
              "payment_status": "STATUS_ACCEPTED",
              "created_at": "2022-07-12T10:31:29+00:00"
            },
            {
              "action": "capture",
              "amount": 1029.25,
              "payment_status": "STATUS_ACCEPTED",
              "created_at": "2022-07-12T10:31:29+00:00"
            },
            {
              "action": "refund",
              "amount": 250,
              "payment_status": "STATUS_REFUNDED",
              "created_at": "2022-07-12T10:32:13+00:00"
            },
            {
              "action": "statuschanged",
              "amount": 1029.25,
              "payment_status": "STATUS_REFUNDED",
              "created_at": "2022-07-12T10:32:13+00:00"
            },
            {
              "action": "refund",
              "amount": 150,
              "payment_status": "STATUS_REFUNDED",
              "created_at": "2022-07-12T10:32:27+00:00"
            }
          ],
            "payment_details": {
            "adsAgreement": false,
            "recipientHolder": "MyCompany Inc.",
            "recipientIban": "DE04888888880087654321",
            "senderHolder": "Testbank",
            "senderIban": "DE93888888880043218765",
            "wizardSessionKey": "lBIfdFgEz9UXTIYU8nt2IZmMu0srIdGSXWPI5hC3",
            "transactionId": "11348-xp-CYiB-tY44"
          }
        }
      }
    }
    """
    And process messages from RabbitMQ "async_events_payment_notifications_micro" channel
    Then model "ApiCall" with id "{{apiCallId}}" should contain json:
    """
    {
      "_id": "{{apiCallId}}",
      "paymentId": "{{paymentId}}"
    }
    """
    And I look for model "Notification" by following JSON and remember as "notification":
    """
    {
      "paymentId": "{{paymentId}}"
    }
    """
    Then print storage key "notification"
    Then model "Notification" with id "{{notification._id}}" should contain json:
    """
    {
      "_id": "{{notification._id}}",
      "deliveryAttempts": [],
      "retriesNumber": 0,
      "apiCallId": "{{apiCallId}}",
      "message": "{\"created_at\":\"*\",\"data\":{\"payment\":{\"id\":\"a42a90bd-a36e-45af-8a16-0cde3eb2cb75\",\"amount\":1000,\"address\":{\"city\":\"dfdsf\",\"country\":\"DE\",\"email\":\"sadas@assa.md\",\"first_name\":\"Test\",\"last_name\":\"Test\",\"phone\":\"123456789\",\"salutation\":\"SALUTATION_MR\",\"street\":\"ssdfdsf\",\"zip_code\":\"12345\"},\"channel\":\"api\",\"created_at\":\"2020-03-05T10:53:23+00:00\",\"currency\":\"EUR\",\"customer_email\":\"asas@asas.md\",\"customer_name\":\"Test Test\",\"delivery_fee\":0,\"down_payment\":0,\"merchant_name\":\"Test\",\"payment_details\":{\"adsAgreement\":false,\"recipientHolder\":\"MyCompany Inc.\",\"recipientIban\":\"DE04888888880087654321\",\"senderHolder\":\"Testbank\",\"senderIban\":\"DE93888888880043218765\",\"wizardSessionKey\":\"lBIfdFgEz9UXTIYU8nt2IZmMu0srIdGSXWPI5hC3\",\"transactionId\":\"11348-xp-CYiB-tY44\"},\"payment_details_array\":{\"adsAgreement\":false,\"recipientHolder\":\"MyCompany Inc.\",\"recipientIban\":\"DE04888888880087654321\",\"senderHolder\":\"Testbank\",\"senderIban\":\"DE93888888880043218765\",\"wizardSessionKey\":\"lBIfdFgEz9UXTIYU8nt2IZmMu0srIdGSXWPI5hC3\",\"transactionId\":\"11348-xp-CYiB-tY44\"},\"payment_fee\":29.25,\"payment_type\":\"instant_payment\",\"reference\":\"asdasdasd\",\"specific_status\":null,\"status\":\"STATUS_REFUNDED\",\"total\":1029.25,\"updated_at\":\"2020-03-05T10:53:24+00:00\",\"refund_amount\":200},\"action\":{\"amount\":200,\"type\":\"refund\"}},\"notification_type\":\"payment.changed\"}",
      "paymentId": "{{paymentId}}",
      "status": "processing",
      "url": "https://notice.url?api_call_id={{apiCallId}}&payment_id={{paymentId}}"
    }
    """

  Scenario: Payment updated event with partial cancel amount
    Given I remember as "paymentId" following value:
    """
    "a42a90bd-a36e-45af-8a16-0cde3eb2cb75"
    """
    Given I remember as "apiCallId" following value:
    """
    "88879e63-d3a8-4547-8d3d-7797dc217bd0"
    """
    Given I use DB fixture "payment-bus-message/create/api-call-without-payment"
    When I publish in RabbitMQ channel "async_events_payment_notifications_micro" message with json:
    """
    {
      "name": "integration.event.payment.create-notification",
      "payload": {
        "action": "cancel",
        "amount": 200,
        "action_source": "external",
        "reference": "12345",
        "payment": {
          "delivery_fee": 0,
          "payment_fee": 29.25,
          "id": "{{paymentId}}",
          "uuid": "{{paymentId}}",
          "amount": 1000,
          "address": {
            "city": "dfdsf",
            "country": "DE",
            "country_name": "DE",
            "email": "sadas@assa.md",
            "first_name": "Test",
            "last_name": "Test",
            "phone": "123456789",
            "salutation": "SALUTATION_MR",
            "street": "ssdfdsf",
            "zip_code": "12345"
          },
          "api_call_id": "{{apiCallId}}",
          "business": {
            "company_name": "Test",
            "id": "123456",
            "slug": "123456",
            "uuid": "123456"
          },
          "channel": "api",
          "created_at": "2020-03-05T10:53:23+00:00",
          "currency": "EUR",
          "customer_email": "asas@asas.md",
          "customer_name": "Test Test",
          "down_payment": 0,
          "payment_type": "instant_payment",
          "reference": "asdasdasd",
          "specific_status": null,
          "status": "STATUS_REFUNDED",
          "total": 1029.25,
          "updated_at": "2020-03-05T10:53:24+00:00",
          "items": [],
          "history": [
            {
              "action": "statuschanged",
              "amount": 1029.25,
              "payment_status": "STATUS_ACCEPTED",
              "created_at": "2022-07-12T10:31:29+00:00"
            },
            {
              "action": "capture",
              "amount": 1029.25,
              "payment_status": "STATUS_ACCEPTED",
              "created_at": "2022-07-12T10:31:29+00:00"
            },
            {
              "action": "refund",
              "amount": 250,
              "payment_status": "STATUS_REFUNDED",
              "created_at": "2022-07-12T10:32:13+00:00"
            },
            {
              "action": "statuschanged",
              "amount": 1029.25,
              "payment_status": "STATUS_REFUNDED",
              "created_at": "2022-07-12T10:32:13+00:00"
            },
            {
              "action": "refund",
              "amount": 150,
              "payment_status": "STATUS_REFUNDED",
              "created_at": "2022-07-12T10:32:27+00:00"
            }
          ],
          "payment_details": {
            "adsAgreement": false,
            "recipientHolder": "MyCompany Inc.",
            "recipientIban": "DE04888888880087654321",
            "senderHolder": "Testbank",
            "senderIban": "DE93888888880043218765",
            "wizardSessionKey": "lBIfdFgEz9UXTIYU8nt2IZmMu0srIdGSXWPI5hC3",
            "transactionId": "11348-xp-CYiB-tY44"
          }
        }
      }
    }
    """
    And process messages from RabbitMQ "async_events_payment_notifications_micro" channel
    Then model "ApiCall" with id "{{apiCallId}}" should contain json:
    """
    {
      "_id": "{{apiCallId}}",
      "paymentId": "{{paymentId}}"
    }
    """
    And I look for model "Notification" by following JSON and remember as "notification":
    """
    {
      "paymentId": "{{paymentId}}"
    }
    """
    Then print storage key "notification"
    Then model "Notification" with id "{{notification._id}}" should contain json:
    """
    {
      "_id": "{{notification._id}}",
      "deliveryAttempts": [],
      "retriesNumber": 0,
      "apiCallId": "{{apiCallId}}",
      "message": "{\"created_at\":\"*\",\"data\":{\"payment\":{\"id\":\"a42a90bd-a36e-45af-8a16-0cde3eb2cb75\",\"amount\":1000,\"address\":{\"city\":\"dfdsf\",\"country\":\"DE\",\"email\":\"sadas@assa.md\",\"first_name\":\"Test\",\"last_name\":\"Test\",\"phone\":\"123456789\",\"salutation\":\"SALUTATION_MR\",\"street\":\"ssdfdsf\",\"zip_code\":\"12345\"},\"channel\":\"api\",\"created_at\":\"2020-03-05T10:53:23+00:00\",\"currency\":\"EUR\",\"customer_email\":\"asas@asas.md\",\"customer_name\":\"Test Test\",\"delivery_fee\":0,\"down_payment\":0,\"merchant_name\":\"Test\",\"payment_details\":{\"adsAgreement\":false,\"recipientHolder\":\"MyCompany Inc.\",\"recipientIban\":\"DE04888888880087654321\",\"senderHolder\":\"Testbank\",\"senderIban\":\"DE93888888880043218765\",\"wizardSessionKey\":\"lBIfdFgEz9UXTIYU8nt2IZmMu0srIdGSXWPI5hC3\",\"transactionId\":\"11348-xp-CYiB-tY44\"},\"payment_details_array\":{\"adsAgreement\":false,\"recipientHolder\":\"MyCompany Inc.\",\"recipientIban\":\"DE04888888880087654321\",\"senderHolder\":\"Testbank\",\"senderIban\":\"DE93888888880043218765\",\"wizardSessionKey\":\"lBIfdFgEz9UXTIYU8nt2IZmMu0srIdGSXWPI5hC3\",\"transactionId\":\"11348-xp-CYiB-tY44\"},\"payment_fee\":29.25,\"payment_type\":\"instant_payment\",\"reference\":\"asdasdasd\",\"specific_status\":null,\"status\":\"STATUS_REFUNDED\",\"total\":1029.25,\"updated_at\":\"2020-03-05T10:53:24+00:00\",\"cancel_amount\":200},\"action\":{\"amount\":200,\"reference\":\"12345\",\"source\":\"external\",\"type\":\"cancel\"}},\"notification_type\":\"payment.changed\"}",
      "paymentId": "{{paymentId}}",
      "status": "processing",
      "url": "https://notice.url?api_call_id={{apiCallId}}&payment_id={{paymentId}}"
    }
    """

