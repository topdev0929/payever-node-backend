Feature: Flow API

  Scenario: Get checkout by flow

    Given I use DB fixture "flow/flow/get-checkout"
    When I send a GET request to "/api/checkout/v1/flow/flowId1/checkout"

    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "businessUuid": "a903d4c3-c447-4aab-a8c7-c7f184a8e77f",
        "testingMode": true,
        "languages": [],
        "message": "Hello!",
        "uuid": "a903d4c3-c447-4aab-a8c7-c7f184a8e77f",
        "name": "*",
        "currency": "USD",
        "paymentMethods": [],
        "sections": [
          {
            "code": "order",
            "enabled": true,
            "order": 0,
            "_id": "*"
          },
          {
            "code": "address",
            "enabled": true,
            "order": 1,
            "_id": "*"
          },
          {
            "code": "choosePayment",
            "enabled": true,
            "order": 2,
            "_id": "*"
          },
          {
            "options": {
              "skipButton": false
            },
            "code": "ocr",
            "enabled": true,
            "order": 3,
            "_id": "*"
          },
          {
            "code": "payment",
            "enabled": true,
            "order": 4,
            "_id": "*"
          },
          {
            "code": "user",
            "enabled": false,
            "order": 5,
            "_id": "*"
          }
        ],
        "limits": {}
      }
      """

  Scenario: Update flow's checkout

    Given I use DB fixture "flow/flow/update-checkout"
    When I send a PUT request to "/api/checkout/v1/flow/flowId1/checkout" with json:
      """
      {
        "checkoutUuid": "check1"
      }
      """

    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "businessUuid": "b903d4c3-c447-4aab-a8c7-c7f184a8e77f",
        "testingMode": true,
        "languages": [],
        "message": "Hello!",
        "uuid": "check1",
        "name": "*",
        "currency": "USD",
        "paymentMethods": [],
        "sections": [
          {
            "code": "order",
            "enabled": true,
            "order": 0,
            "_id": "*"
          },
          {
            "code": "address",
            "enabled": true,
            "order": 1,
            "_id": "*"
          },
          {
            "code": "choosePayment",
            "enabled": true,
            "order": 2,
            "_id": "*"
          },
          {
            "options": {
              "skipButton": false
            },
            "code": "ocr",
            "enabled": true,
            "order": 3,
            "_id": "*"
          },
          {
            "code": "payment",
            "enabled": true,
            "order": 4,
            "_id": "*"
          },
          {
            "code": "user",
            "enabled": false,
            "order": 5,
            "_id": "*"
          }
        ],
        "limits": {}
      }
      """

  Scenario: Update flow's checkout

    Given I use DB fixture "flow/flow/update-checkout2"
    When I send a POST request to "/api/checkout/v1/flow/flowId1/channel-set/channelId1"

    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "businessUuid": "b903d4c3-c447-4aab-a8c7-c7f184a8e77f",
        "testingMode": true,
        "languages": [],
        "message": "Hello!",
        "uuid": "check1",
        "name": "*",
        "currency": "USD",
        "paymentMethods": [],
        "sections": [
          {
            "code": "order",
            "enabled": true,
            "order": 0,
            "_id": "*"
          },
          {
            "code": "address",
            "enabled": true,
            "order": 1,
            "_id": "*"
          },
          {
            "code": "choosePayment",
            "enabled": true,
            "order": 2,
            "_id": "*"
          },
          {
            "options": {
              "skipButton": false
            },
            "code": "ocr",
            "enabled": true,
            "order": 3,
            "_id": "*"
          },
          {
            "code": "payment",
            "enabled": true,
            "order": 4,
            "_id": "*"
          },
          {
            "code": "user",
            "enabled": false,
            "order": 5,
            "_id": "*"
          }
        ],
        "limits": {}
      }
      """

  Scenario: Send to device - ok

    Given I use DB fixture "flow/flow/send-to-device-ok"
    When I send a POST request to "/api/checkout/v1/flow/flowId1/send-to-device" with json:
      """
      {
        "message": "check1"
      }
      """

    Then print last response
    And the response status code should be 200

  Scenario: Send to device - message validation

    Given I use DB fixture "flow/flow/send-to-device-validation"
    When I send a POST request to "/api/checkout/v1/flow/flowId1/send-to-device" with json:
      """
      {
        "subject": "check1"
      }
      """

    Then print last response
    And the response status code should be 400
    And the response should contain json:
      """
      {
        "statusCode": 400,
        "error": "Bad Request",
        "message": [
          {
            "target": {
              "subject": "check1"
            },
            "property": "message",
            "children": [],
            "constraints": {
              "isNotEmpty": "message should not be empty"
            }
          }
        ]
      }
      """

  Scenario: Send to device - email sent

    Given I use DB fixture "flow/flow/send-to-device-email-sent"
    When I send a POST request to "/api/checkout/v1/flow/flowId1/send-to-device" with json:
      """
      {
        "message": "check1",
        "subject": "check2",
        "email": "test@test.com"
      }
      """

    And the response status code should be 200
    And print RabbitMQ exchange "async_events" message list
    And the RabbitMQ exchange "async_events" should contain following ordered messages:
      """
      [
        {
          "name": "payever.event.mailer.send",
          "payload": {
            "to": "test@test.com",
            "subject": "check2",
            "html": "check1"
          }
        }
      ]
      """

  Scenario: Send to device - wrong phone number

    Given I use DB fixture "flow/flow/send-to-device-wrong-number"
    When I send a POST request to "/api/checkout/v1/flow/flowId1/send-to-device" with json:
      """
      {
        "message": "check1",
        "phoneFrom": "22222",
        "phoneTo": "11111"
      }
      """

    Then print last response
    And the response status code should be 400
    And the response should contain json:
      """
      {
        "statusCode": 400,
        "error": "Bad Request",
        "message": [
          {
            "target": {
              "message": "check1",
              "phoneFrom": "22222",
              "phoneTo": "11111"
            },
            "value": "22222",
            "property": "phoneFrom",
            "children": [],
            "constraints": {
              "isPhoneNumber": "phoneFrom must be a valid phone number"
            }
          },
          {
            "target": {
              "message": "check1",
              "phoneFrom": "22222",
              "phoneTo": "11111"
            },
            "value": "11111",
            "property": "phoneTo",
            "children": [],
            "constraints": {
              "isPhoneNumber": "phoneTo must be a valid phone number"
            }
          }
        ]
      }
      """
