
Feature: Schedule
  Background:
    Given I remember as "businessId" following value:
      """
      "business1"
      """
    Given I remember as "anotherBusinessId" following value:
      """
      "business2"
      """
    Given I remember as "scheduleId" following value:
      """
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    Given I remember as "anotherScheduleId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """

    Given I remember as "wrongScheduleId" following value:
      """
      "cccccccc-cccc-cccc-cccc-cccccccccccc"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@email.com"
      }
      """

  Scenario: User doesn't have permission to export report
    When I send a GET request to "/api/schedule-settlement/{{businessId}}"
    Then print last response
    And the response status code should be 403
    When I send a GET request to "/api/schedule-settlement/{{businessId}}/{{scheduleId}}"
    Then print last response
    And the response status code should be 403

  Scenario: User with another businessId doesn't have permission to access schedules of others
    Given I use DB fixture "schedules"
    And I authenticate as a user with the following data:
      """
      {
        "email": "email@email.com",
        "roles": [
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "{{anotherBusinessId}}",
                "acls": []
              }
            ]
          }
        ]
      }
      """

    When I send a GET request to "/api/schedule-settlement/{{businessId}}"
    Then print last response
    And the response status code should be 403

    When I send a GET request to "/api/schedule-settlement/{{businessId}}/{{scheduleId}}"
    Then print last response
    And the response status code should be 403


Scenario: Settlement report testing
  Given I use DB fixture "schedules"
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

  When I send a POST request to "/api/schedule-settlement/{{businessId}}"
  Then print last response
  And the response status code should be 400

  When I send a POST request to "/api/schedule-settlement/{{businessId}}" with json:
   """
    {
      "email":"nadernmds@pep.com",
      "duration": "WEEKLY",
      "paymentMethod":"paypal",
      "enabled":false
    }
    """
  Then print last response
  And the response status code should be 200
  When I send a POST request to "/api/schedule-settlement/{{anotherBusinessId}}" with json:
   """
    {
      "email":"nadernmds@pep.com",
      "duration": "WEEKLY",
      "paymentMethod":"paypal",
      "enabled":false
    }
    """
  Then print last response
  And the response status code should be 403

  When I send a PUT request to "/api/schedule-settlement/{{businessId}}/{{scheduleId}}" with json:
   """
    {
      "email":"nadernmds@pep.com",
      "duration": "WEEKLY",
      "paymentMethod":"paypal",
      "enabled":false
    }
    """
  Then print last response
  And the response status code should be 200

  When I send a PUT request to "/api/schedule-settlement/{{businessId}}/{{wrongScheduleId}}" with json:
   """
    {
      "email":"nadernmds@pep.com",
      "duration": "WEEKLY",
      "paymentMethod":"paypal",
      "enabled":false
    }
    """
  Then print last response
  And the response status code should be 404

  When I send a PUT request to "/api/schedule-settlement/{{businessId}}/{{scheduleId}}" with json:
   """
    {
      "email":"nadernmds@pep.com",
      "enabled":false
    }
    """
  Then print last response
  And the response status code should be 400

  When I send a PUT request to "/api/schedule-settlement/{{anotherBusinessId}}/{{scheduleId}}" with json:
   """
    {
      "email":"nadernmds@pep.com",
      "duration": "WEEKLY",
      "paymentMethod":"paypal",
      "enabled":false
    }
    """
  Then print last response
  And the response status code should be 403

  When I send a GET request to "/api/schedule-settlement/{{businessId}}/{{scheduleId}}"
  Then print last response
  And the response status code should be 200

  When I send a GET request to "/api/schedule-settlement/{{businessId}}/{{wrongScheduleId}}"
  Then print last response
  And the response status code should be 404

  When I send a GET request to "/api/schedule-settlement/{{anotherBusinessId}}/{{scheduleId}}"
  Then print last response
  And the response status code should be 403

  When I send a PATCH request to "/api/schedule-settlement/{{businessId}}/{{scheduleId}}/enable"
  Then print last response
  And the response status code should be 200

  When I send a PATCH request to "/api/schedule-settlement/{{businessId}}/{{wrongScheduleId}}/enable"
  Then print last response
  And the response status code should be 404

  When I send a PATCH request to "/api/schedule-settlement/{{anotherBusinessId}}/{{scheduleId}}/enable"
  Then print last response
  And the response status code should be 403

  When I send a PATCH request to "/api/schedule-settlement/{{businessId}}/{{scheduleId}}/disable"
  Then print last response
  And the response status code should be 200

  When I send a PATCH request to "/api/schedule-settlement/{{businessId}}/{{wrongScheduleId}}/disable"
  Then print last response
  And the response status code should be 404

  When I send a PATCH request to "/api/schedule-settlement/{{anotherBusinessId}}/{{scheduleId}}/disable"
  Then print last response
  And the response status code should be 403

  When I send a DELETE request to "/api/schedule-settlement/{{businessId}}/{{scheduleId}}"
  Then print last response
  And the response status code should be 200

  When I send a DELETE request to "/api/schedule-settlement/{{businessId}}/{{wrongScheduleId}}"
  Then print last response
  And the response status code should be 404

  When I send a DELETE request to "/api/schedule-settlement/{{anotherBusinessId}}/{{scheduleId}}"
  Then print last response
  And the response status code should be 403
