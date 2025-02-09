Feature: Domain API
  Background:
    Given I remember as "businessId" following value:
      """
        "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "connectionId" following value:
      """
        "dddddddd-dddd-dddd-dddd-dddddddddddd"
      """
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

  Scenario: get connections
    Given I use DB fixture "connection"
    When I send a GET request to "/api/business/{{businessId}}/connection"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      [
           {
             "_id": "dddddddd-dddd-dddd-dddd-dddddddddddc",
             "integration": {
               "isVisible": true,
               "_id": "paypal",
               "category": "payments",
               "name": "paypal"
             }
           },
           {
             "_id": "dddddddd-dddd-dddd-dddd-dddddddddddd",
             "integration": {
               "isVisible": true,
               "_id": "stripe",
               "category": "payments",
               "name": "stripe"
             }
           }
         ]
      """

  Scenario: install and uninstall connection
    Given I use DB fixture "connection"
    When I send a PATCH request to "/api/business/{{businessId}}/connection/{{connectionId}}/install"
    Then print last response
    And the response status code should be 200
    And model "Connection" with id "{{connectionId}}" should contain json:
      """
      {
        "isEnabled": true
      }
      """
    When I send a PATCH request to "/api/business/{{businessId}}/connection/{{connectionId}}/uninstall"
    Then print last response
    And the response status code should be 200
    And model "Connection" with id "{{connectionId}}" should contain json:
      """
      {
        "isEnabled": false
      }
      """
