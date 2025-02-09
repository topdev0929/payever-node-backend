Feature: Channel set API

  Scenario: Send to device - check sms

    Given I use DB fixture "flow/should-be-exuceted-first-flow-axio-test/flows"
    Given I mock an axios request with parameters:
      """
      {
        "request": {
          "method": "post",
          "url": "https://third-party.test.devpayever.com/api/business/a903d4c3-c447-4aab-a8c7-c7f184a8e77f/communications/testName/send"
        },
        "response": {
          "status": 200,
          "body": "{\"test\": \"ok\"}"
        }
      }
      """

    When I send a POST request to "/api/checkout/v1/flow/flowId1/send-to-device" with json:
      """
      {
        "message": "check1",
        "phoneFrom": "+79897137970",
        "phoneTo": "+79897137971"
      }
      """

    Then print last response
    Then axios mocks should be called
    And the response status code should be 200
