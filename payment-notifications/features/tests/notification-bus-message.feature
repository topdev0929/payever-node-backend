Feature: Handle notification bus message events
  Scenario: Send notification event successfully
    Given I remember as "notificationId" following value:
    """
    "b948082c-246e-46a4-a87a-41a4241ad24c"
    """
    Given I use DB fixture "notification-bus-message/send/new-notification"
    When I publish in RabbitMQ channel "payment_notifications_1" message with json:
    """
    {
      "name": "1",
      "payload": {
        "notificationId": "{{notificationId}}"
      }
    }
    """
    And I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "post",
        "url": "http://notice.url",
        "body": "{\"notification_type\":\"payment.created\",\"created_at\":\"2020-02-27T15:20:19.767Z\",\"data\":{\"payment\":{\"delivery_fee\":0,\"payment_fee\":0,\"id\":\"e4ae44e5-d218-41e8-a789-1c9c6c03a48a\",\"uuid\":\"e4ae44e5-d218-41e8-a789-1c9c6c03a48a\",\"amount\":200.12,\"address\":{\"city\":\"Berlin\",\"country\":\"DE\",\"country_name\":\"DE\",\"email\":\"test@test.com\",\"first_name\":\"First name\",\"last_name\":\"Last name\",\"phone\":\"+49837455\",\"salutation\":\"MR\",\"street\":\"staze 2\",\"zip_code\":\"1234\"},\"api_call_id\":\"b6ae699a-e5c7-40e5-a97e-8de5f20315e2\",\"business\":{\"company_name\":\"business-1\",\"id\":\"b197bf22-6309-11e7-a2a8-5254008319f0\",\"slug\":\"b197bf22-6309-11e7-a2a8-5254008319f0\",\"uuid\":\"b197bf22-6309-11e7-a2a8-5254008319f0\"},\"channel\":\"api\",\"created_at\":\"2020-02-27T15:20:19+00:00\",\"currency\":\"EUR\",\"customer_email\":\"test@test.com\",\"customer_name\":\"Test\",\"down_payment\":0,\"payment_type\":\"instant_payment\",\"reference\":\"qwerty\",\"status\":\"STATUS_NEW\",\"total\":200.12,\"updated_at\":\"2020-02-27T15:20:19+00:00\",\"items\":[],\"payment_details\":{\"recipientHolder\":\"Holder\",\"recipientIban\":\"DE04888888880087654321\"}}}}",
        "headers": {
          "Accept": "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      },
      "response": {
        "status": 200,
        "statusText": "OK",
        "data": {}
      }
    }
    """
    And process messages from RabbitMQ "payment_notifications_1" channel
    Then I look for model "DeliveryAttempt" by following JSON and remember as "delivery_attempt":
    """
    {
      "notificationId": "{{notificationId}}",
      "status": "success",
      "responseStatusCode": 200
    }
    """
    And model "Notification" with id "{{notificationId}}" should contain json:
    """
    {
      "_id": "{{notificationId}}",
      "retriesNumber": 1,
      "status": "success",
      "deliveryAttempts": [
        "{{delivery_attempt._id}}"
      ]
    }
    """

  Scenario: Send notification event unsuccessfully
    Given I remember as "notificationId" following value:
    """
    "b948082c-246e-46a4-a87a-41a4241ad24c"
    """
    Given I use DB fixture "notification-bus-message/send/new-notification"
    When I publish in RabbitMQ channel "payment_notifications_1" message with json:
    """
    {
      "name": "1",
      "payload": {
        "notificationId": "{{notificationId}}"
      }
    }
    """
    And I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "post",
        "url": "http://notice.url",
        "body": "{\"notification_type\":\"payment.created\",\"created_at\":\"2020-02-27T15:20:19.767Z\",\"data\":{\"payment\":{\"delivery_fee\":0,\"payment_fee\":0,\"id\":\"e4ae44e5-d218-41e8-a789-1c9c6c03a48a\",\"uuid\":\"e4ae44e5-d218-41e8-a789-1c9c6c03a48a\",\"amount\":200.12,\"address\":{\"city\":\"Berlin\",\"country\":\"DE\",\"country_name\":\"DE\",\"email\":\"test@test.com\",\"first_name\":\"First name\",\"last_name\":\"Last name\",\"phone\":\"+49837455\",\"salutation\":\"MR\",\"street\":\"staze 2\",\"zip_code\":\"1234\"},\"api_call_id\":\"b6ae699a-e5c7-40e5-a97e-8de5f20315e2\",\"business\":{\"company_name\":\"business-1\",\"id\":\"b197bf22-6309-11e7-a2a8-5254008319f0\",\"slug\":\"b197bf22-6309-11e7-a2a8-5254008319f0\",\"uuid\":\"b197bf22-6309-11e7-a2a8-5254008319f0\"},\"channel\":\"api\",\"created_at\":\"2020-02-27T15:20:19+00:00\",\"currency\":\"EUR\",\"customer_email\":\"test@test.com\",\"customer_name\":\"Test\",\"down_payment\":0,\"payment_type\":\"instant_payment\",\"reference\":\"qwerty\",\"status\":\"STATUS_NEW\",\"total\":200.12,\"updated_at\":\"2020-02-27T15:20:19+00:00\",\"items\":[],\"payment_details\":{\"recipientHolder\":\"Holder\",\"recipientIban\":\"DE04888888880087654321\"}}}}",
        "headers": {
          "Accept": "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      },
      "response": {
        "status": 404,
        "body": {
          "description": "Error content"
        }
      }
    }
    """
    And process messages from RabbitMQ "payment_notifications_1" channel
    Then I look for model "DeliveryAttempt" by following JSON and remember as "delivery_attempt":
    """
    {
      "notificationId": "{{notificationId}}",
      "status": "failed",
      "responseStatusCode": 404,
      "responseMessage": "{\"description\":\"Error content\"}"
    }
    """
    And model "Notification" with id "{{notificationId}}" should contain json:
    """
    {
      "_id": "{{notificationId}}",
      "retriesNumber": 1,
      "status": "failed",
      "deliveryAttempts": [
        "{{delivery_attempt._id}}"
      ]
    }
    """

  Scenario: Notification not found
    When I publish in RabbitMQ channel "payment_notifications_1" message with json:
    """
    {
      "name": "1",
      "payload": {
        "notificationId": "invalid-notification-id"
      }
    }
    """
    And process messages from RabbitMQ "payment_notifications_1" channel
    And model "Notification" with id "invalid-notification-id" should not exist

  Scenario: Send notification event with notification status success
    Given I remember as "notificationId" following value:
    """
    "b948082c-246e-46a4-a87a-41a4241ad24c"
    """
    Given I use DB fixture "notification-bus-message/send/success-notification"
    When I publish in RabbitMQ channel "payment_notifications_1" message with json:
    """
    {
      "name": "1",
      "payload": {
        "notificationId": "{{notificationId}}"
      }
    }
    """
    And process messages from RabbitMQ "payment_notifications_1" channel
    Then model "DeliveryAttempt" found by following JSON should not exist:
    """
    {
      "notificationId": "{{notificationId}}"
    }
    """
    And model "Notification" with id "{{notificationId}}" should contain json:
    """
    {
      "_id": "{{notificationId}}",
      "retriesNumber": 1,
      "status": "success",
      "deliveryAttempts": []
    }
    """

  Scenario: Send notification event second time after unsuccessful first attempt
    Given I remember as "notificationId" following value:
    """
    "b948082c-246e-46a4-a87a-41a4241ad24c"
    """
    Given I use DB fixture "notification-bus-message/send/failed-notification"
    When I publish in RabbitMQ channel "payment_notifications_1" message with json:
    """
    {
      "name": "1",
      "payload": {
        "notificationId": "{{notificationId}}"
      }
    }
    """
    And I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "post",
        "url": "http://notice.url",
        "body": "{\"notification_type\":\"payment.created\",\"created_at\":\"2020-02-27T15:20:19.767Z\",\"data\":{\"payment\":{\"delivery_fee\":0,\"payment_fee\":0,\"id\":\"e4ae44e5-d218-41e8-a789-1c9c6c03a48a\",\"uuid\":\"e4ae44e5-d218-41e8-a789-1c9c6c03a48a\",\"amount\":200.12,\"address\":{\"city\":\"Berlin\",\"country\":\"DE\",\"country_name\":\"DE\",\"email\":\"test@test.com\",\"first_name\":\"First name\",\"last_name\":\"Last name\",\"phone\":\"+49837455\",\"salutation\":\"MR\",\"street\":\"staze 2\",\"zip_code\":\"1234\"},\"api_call_id\":\"b6ae699a-e5c7-40e5-a97e-8de5f20315e2\",\"business\":{\"company_name\":\"business-1\",\"id\":\"b197bf22-6309-11e7-a2a8-5254008319f0\",\"slug\":\"b197bf22-6309-11e7-a2a8-5254008319f0\",\"uuid\":\"b197bf22-6309-11e7-a2a8-5254008319f0\"},\"channel\":\"api\",\"created_at\":\"2020-02-27T15:20:19+00:00\",\"currency\":\"EUR\",\"customer_email\":\"test@test.com\",\"customer_name\":\"Test\",\"down_payment\":0,\"payment_type\":\"instant_payment\",\"reference\":\"qwerty\",\"status\":\"STATUS_NEW\",\"total\":200.12,\"updated_at\":\"2020-02-27T15:20:19+00:00\",\"items\":[],\"payment_details\":{\"recipientHolder\":\"Holder\",\"recipientIban\":\"DE04888888880087654321\"}}}}",
        "headers": {
          "Accept": "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      },
      "response": {
        "status": 200,
        "statusText": "OK",
        "data": {}
      }
    }
    """
    And process messages from RabbitMQ "payment_notifications_1" channel
    Then I look for model "DeliveryAttempt" by following JSON and remember as "delivery_attempt":
    """
    {
      "notificationId": "{{notificationId}}",
      "status": "success",
      "responseStatusCode": 200
    }
    """
    And model "Notification" with id "{{notificationId}}" should contain json:
    """
    {
      "_id": "{{notificationId}}",
      "retriesNumber": 2,
      "status": "success",
      "deliveryAttempts": [
        "{{delivery_attempt._id}}"
      ]
    }
    """

  Scenario: Send notification event with signature
    Given I remember as "notificationId" following value:
    """
    "b948082c-246e-46a4-a87a-41a4241ad24c"
    """
    Given I use DB fixture "notification-bus-message/send/notification-with-client-id"
    When I publish in RabbitMQ channel "payment_notifications_1" message with json:
    """
    {
      "name": "1",
      "payload": {
        "notificationId": "{{notificationId}}"
      }
    }
    """

    And I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "get",
        "url": "https://auth.test.devpayever.com/oauth/business-id/clients/client-id",
        "headers": {
          "Accept": "application/json, text/plain, */*",
          "authorization": "Bearer *"
        }
      },
      "response": {
        "status": 200,
        "statusText": "OK",
        "body": {
          "secret": "oauth-client-secret"
        }
      }
    }
    """
    And I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "post",
        "url": "http://notice.url",
        "body": "{\"notification_type\":\"payment.created\",\"created_at\":\"2020-02-27T15:20:19.767Z\",\"data\":{\"payment\":{\"delivery_fee\":0,\"payment_fee\":0,\"id\":\"e4ae44e5-d218-41e8-a789-1c9c6c03a48a\",\"uuid\":\"e4ae44e5-d218-41e8-a789-1c9c6c03a48a\",\"amount\":200.12,\"address\":{\"city\":\"Berlin\",\"country\":\"DE\",\"country_name\":\"DE\",\"email\":\"test@test.com\",\"first_name\":\"First name\",\"last_name\":\"Last name\",\"phone\":\"+49837455\",\"salutation\":\"MR\",\"street\":\"staze 2\",\"zip_code\":\"1234\"},\"api_call_id\":\"b6ae699a-e5c7-40e5-a97e-8de5f20315e2\",\"business\":{\"company_name\":\"business-1\",\"id\":\"b197bf22-6309-11e7-a2a8-5254008319f0\",\"slug\":\"b197bf22-6309-11e7-a2a8-5254008319f0\",\"uuid\":\"b197bf22-6309-11e7-a2a8-5254008319f0\"},\"channel\":\"api\",\"created_at\":\"2020-02-27T15:20:19+00:00\",\"currency\":\"EUR\",\"customer_email\":\"test@test.com\",\"customer_name\":\"Test\",\"down_payment\":0,\"payment_type\":\"instant_payment\",\"reference\":\"qwerty\",\"status\":\"STATUS_NEW\",\"total\":200.12,\"updated_at\":\"2020-02-27T15:20:19+00:00\",\"items\":[],\"payment_details\":{\"recipientHolder\":\"Holder\",\"recipientIban\":\"DE04888888880087654321\"}}}}",
        "headers": {
          "Accept": "application/json, text/plain, */*",
          "Content-Type": "application/json",
          "X-PAYEVER-SIGNATURE": "74d4d64936ba58684338c2b3957e3ec2d242f1d0e87d9c3de74dda458a6a4629"
        }
      },
      "response": {
        "status": 200,
        "statusText": "OK",
        "body": {}
      }
    }
    """

    And process messages from RabbitMQ "payment_notifications_1" channel
    Then I look for model "DeliveryAttempt" by following JSON and remember as "delivery_attempt":
    """
    {
      "notificationId": "{{notificationId}}",
      "status": "success",
      "responseStatusCode": 200
    }
    """
    Then print storage key "delivery_attempt"
    And model "Notification" with id "{{notificationId}}" should contain json:
    """
    {
      "_id": "{{notificationId}}",
      "retriesNumber": 1,
      "status": "success",
      "deliveryAttempts": [
        "{{delivery_attempt._id}}"
      ]
    }
    """

  Scenario: Send notification event unsuccessfully with response status code 500
    Given I remember as "notificationId" following value:
    """
    "b948082c-246e-46a4-a87a-41a4241ad24c"
    """
    Given I use DB fixture "notification-bus-message/send/exists-attempts-notification"
    When I publish in RabbitMQ channel "payment_notifications_1" message with json:
    """
    {
      "routingKey": "1",
      "name": "",
      "payload": {
        "notificationId": "{{notificationId}}"
      }
    }
    """
    And I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "post",
        "url": "http://notice.url",
        "body": "{\"notification_type\":\"payment.created\",\"created_at\":\"2020-02-27T15:20:19.767Z\",\"data\":{\"payment\":{\"delivery_fee\":0,\"payment_fee\":0,\"id\":\"e4ae44e5-d218-41e8-a789-1c9c6c03a48a\",\"uuid\":\"e4ae44e5-d218-41e8-a789-1c9c6c03a48a\",\"amount\":200.12,\"address\":{\"city\":\"Berlin\",\"country\":\"DE\",\"country_name\":\"DE\",\"email\":\"test@test.com\",\"first_name\":\"First name\",\"last_name\":\"Last name\",\"phone\":\"+49837455\",\"salutation\":\"MR\",\"street\":\"staze 2\",\"zip_code\":\"1234\"},\"api_call_id\":\"b6ae699a-e5c7-40e5-a97e-8de5f20315e2\",\"business\":{\"company_name\":\"business-1\",\"id\":\"b197bf22-6309-11e7-a2a8-5254008319f0\",\"slug\":\"b197bf22-6309-11e7-a2a8-5254008319f0\",\"uuid\":\"b197bf22-6309-11e7-a2a8-5254008319f0\"},\"channel\":\"api\",\"created_at\":\"2020-02-27T15:20:19+00:00\",\"currency\":\"EUR\",\"customer_email\":\"test@test.com\",\"customer_name\":\"Test\",\"down_payment\":0,\"payment_type\":\"instant_payment\",\"reference\":\"qwerty\",\"status\":\"STATUS_NEW\",\"total\":200.12,\"updated_at\":\"2020-02-27T15:20:19+00:00\",\"items\":[],\"payment_details\":{\"recipientHolder\":\"Holder\",\"recipientIban\":\"DE04888888880087654321\"}}}}",
        "headers": {
          "Accept": "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      },
      "response": {
        "status": 500,
        "body": {
          "description": "Internal server error"
        }
      }
    }
    """
    And process messages from RabbitMQ "payment_notifications_1" channel
    Then I look for model "DeliveryAttempt" by following JSON and remember as "delivery_attempt":
    """
    {
      "notificationId": "{{notificationId}}",
      "status": "failed",
      "responseStatusCode": 500,
      "responseMessage": "{\"description\":\"Internal server error\"}"
    }
    """
    And model "Notification" with id "{{notificationId}}" should contain json:
    """
    {
      "_id": "{{notificationId}}",
      "retriesNumber": 2,
      "status": "failed",
      "deliveryAttempts": [
        "{{delivery_attempt._id}}"
      ]
    }
    """
    Then RabbitMQ exchange "async_events" should contain following messages:
    """
    [
      {
        "name": "error-notifications.event.payment-notification.failed",
        "payload": {
          "businessId": "13274c5d-fc8d-431e-eed4-112ce0b14cba",
          "noticeUrl": "http://notice.url",
          "paymentId": "9a474c5d-fc8d-431e-bbe8-389ce0b14cbf",
          "statusCode": 500
        }
      }
    ]
    """
