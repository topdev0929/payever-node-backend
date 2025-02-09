Feature: Metrics endpoints
  Background:
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

  Scenario: Get all metrics
    Given I use DB fixture "metric"
    When I send a GET request to "/api/metric"
    Then print last response
    And the response status code should be 200
