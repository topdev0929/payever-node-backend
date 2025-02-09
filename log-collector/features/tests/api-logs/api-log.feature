Feature: api-log
  Background:
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "userId" following value:
      """
      "uuuuuuuu-uuuu-uuuu-uuuu-uuuuuuuuuuuu"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@email.com",
        "id": "{{userId}}",
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
  Scenario: Get api-logs of another business
    Given I am not authenticated
    When I send a GET request to "/api/api-logs"
    Then print last response
    Then the response status code should be 403
    And response should contain json:
      """
      {
        "statusCode": 403,
        "error": "Forbidden"
      }
      """

  Scenario: Get api-logs list without filter
    Given I use DB fixture "api-log/api-log"
    When I send a GET request to "/api/api-logs"
    Then print last response
    Then the response status code should be 200
    And response should contain json:
      """
      {
        "total": 10,
        "page": 1,
        "totalPages": 1,
        "logs": [
          {
            "source": "payever"
          },
          {
            "source": "api"
          }
        ]
      }
      """

  Scenario: Get api-logs list with filter
    Given I use DB fixture "api-log/api-log"
    When I send a GET request to "/api/api-logs?source=payever"
    Then print last response
    Then the response status code should be 200
    And response should contain json:
      """
      {
        "total": 5,
        "page": 1,
        "logs": [
          {
            "source": "payever"
          }
        ]
      }
      """
    When I send a GET request to "/api/api-logs?serviceName=service1"
    Then print last response
    Then the response status code should be 200
    And response should contain json:
      """
      {
        "total": 5,
        "page": 1,
        "logs": [
          {
            "serviceName": "service1"
          }
        ]
      }
      """
    When I send a GET request to "/api/api-logs?serviceName=service1&limit=2000"
    Then print last response
    Then the response status code should be 200
    And response should contain json:
      """
      {
        "total": 5,
        "page": 1,
        "logs": [
          {
            "serviceName": "service1"
          }
        ]
      }
      """
    When I send a GET request to "/api/api-logs?limit=2&page=3"
    Then print last response
    Then the response status code should be 200
    And response should contain json:
      """
      {
        "total": 10,
        "page": 3,
        "logs": []
      }
      """
    When I send a GET request to "/api/api-logs?from=2012-01-01&to=2012-02-01"
    Then print last response
    Then the response status code should be 200
    And response should contain json:
      """
      {
        "total": 0,
        "page": 1,
        "logs": []
      }
      """
