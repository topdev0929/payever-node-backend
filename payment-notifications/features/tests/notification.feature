Feature: Notifications
  Background:
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "paymentId" following value:
      """
      "pppppppp-pppp-pppp-pppp-pppppppppppp"
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
  Scenario: Get notification list of another business
    Given I am not authenticated
    When I send a GET request to "/api/notification"
    Then print last response
    Then the response status code should be 403
    And response should contain json:
      """
      {
        "statusCode": 403,
        "error": "Forbidden"
      }
      """

  Scenario: Get notification list without filter
    Given I use DB fixture "notification/notifications"
    When I send a GET request to "/api/notification"
    Then print last response
    Then the response status code should be 200
    And response should contain json:
      """
      {
        "total": 10,
        "page": 1,
        "events": [
          {
            "status": "failed"
          },
          {
            "status": "success"
          }
        ]
      }
      """

  Scenario: Get notifications by paymentId
    Given I use DB fixture "notification/notifications"
    When I send a GET request to "/api/notification/payment/{{paymentId}}"
    Then print last response
    Then the response status code should be 200
    And response should contain json:
      """
      {
        "total": 10,
        "page": 1,
        "events": [
          {
            "status": "failed"
          },
          {
            "status": "success"
          }
        ]
      }
      """

  Scenario: Get notification list with filter
    Given I use DB fixture "notification/notifications"
    When I send a GET request to "/api/notification?status=failed"
    Then print last response
    Then the response status code should be 200
    And response should contain json:
      """
      {
        "total": 5,
        "page": 1,
        "events": [
          {
            "status": "failed"
          }
        ]
      }
      """
    When I send a GET request to "/api/notification?status=success&limit=2000"
    Then print last response
    Then the response status code should be 200
    And response should contain json:
      """
      {
        "total": 5,
        "page": 1,
        "events": [
          {
            "status": "success"
          }
        ]
      }
      """
    When I send a GET request to "/api/notification?limit=2&page=3"
    Then print last response
    Then the response status code should be 200
    And response should contain json:
      """
      {
        "total": 10,
        "page": 3,
        "events": [
          {
            "status": "success"
          }
        ]
      }
      """
    When I send a GET request to "/api/notification?from=2012-01-01&to=2012-02-01"
    Then print last response
    Then the response status code should be 200
    And response should contain json:
      """
      {
        "total": 0,
        "page": 1,
        "events": []
      }
      """
