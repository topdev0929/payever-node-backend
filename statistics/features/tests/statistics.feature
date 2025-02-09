Feature: Statistics endpoints
  Background:
    Given I remember as "businessId" following value:
      """
      "568192aa-36ea-48d8-bc0a-8660029e6f72"
      """
    Given I remember as "widgetId" following value:
      """
      "31e5db1d-6f0c-431a-a921-db903e8d4447"
      """
    And I authenticate as a user with the following data:
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

  Scenario: Get statistics
    Given I use DB fixture "widget"
    When I send a GET request to "/api/{{widgetId}}/statistics"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
           "data": [
             [
               "Quantity"
             ]
           ],
           "widgetId": "31e5db1d-6f0c-431a-a921-db903e8d4447"
         }
      """

  Scenario: Get ws statistics. Request is authenticated, should return result true
    Given I use DB fixture "widget"
    When I send a Websocket request with json:
     """
      {
        "event": "event-connection",
        "data": {
            "token": ""
        }
      }
      """
    Then print last Websocket response
    Then the Websocket response should contain json:
      """
      {
         "name": "event-connection",
         "result": true
      }
      """

  Scenario: Get ws statistics. Request is unauthenticated, should return result false
    Given I use DB fixture "widget"
    And I am not authenticated
    When I send a Websocket request with json:
     """
      {
        "event": "event-connection",
        "data": {
            "token": ""
        }
      }
      """
    Then print last Websocket response
    Then the Websocket response should contain json:
      """
      {
         "name": "event-connection",
         "result": false
      }
      """

  Scenario: Get ws statistics. Should return result false because request is unauthenticated
    Given I use DB fixture "widget"
    And I am not authenticated
    When I send a Websocket request with json:
     """
      {
        "event": "get-data",
        "data": {
            "widgetId": "widget_not_found",
            "token": ""
        }
      }
      """
    Then print last Websocket response
    Then the Websocket response should contain json:
      """
      {
         "name": "get-data",
         "result": false
      }
      """

  Scenario: Get ws statistics. Should return 'Widget does not exist.'
    Given I use DB fixture "widget"
    When I send a Websocket request with json:
     """
      {
        "event": "get-data",
        "data": {
            "widgetId": "widget_not_found",
            "token": ""
        }
      }
      """
    Then print last Websocket response
    Then the Websocket response should contain json:
      """
      {
         "error": "Widget does not exist.",
         "name": "get-data",
         "result": false,
         "widgetId": "widget_not_found"
      }
      """
  Scenario: Get ws statistics. Should return Quantity
    Given I use DB fixture "widget"
    When I send a Websocket request with json:
     """
      {
        "event": "get-data",
        "data": {
            "widgetId": "{{widgetId}}",
            "token": ""
        }
      }
      """
    Then print last Websocket response
    Then the Websocket response should contain json:
      """
      {
         "defaultData": [
             [
                 "Quantity"
             ]
         ]
      }
      """
