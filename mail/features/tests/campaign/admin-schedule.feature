Feature: Admin endpoints for schedules
  Background:
    Given I use DB fixture "mail/mail"
    Given I use DB fixture "campaign/campaign"
    Given I use DB fixture "campaign/schedule"
    And I remember as "SCHEDULE_ID" following value:
      """
      "372a7cc5-eb3d-4505-91f2-a48acf7c9cb9"
      """
    And I remember as "NEW_SCHEDULE_ID" following value:
      """
      "08f0ed5c-99ee-475b-98e6-c73efdb52dcd"
      """
    And I remember as "CAMPAIGN_ID" following value:
      """
      "ec64531c-a226-4479-a251-5ef11c6d7c25"
      """
    And I remember as "CHANNEL_SET_ID" following value:
      """
      "c07adfb6-8d2e-410c-8a99-4e8b0feb4aad"
      """
    And I remember as "BUSINESS_ID" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    And I authenticate as a user with the following data:
    """
    {
      "email": "email@test.com",
      "roles": [{
        "name": "admin"
      }]
    }
    """

  Scenario: Get one schedule for admin
    When I send a GET request to "/api/admin/schedule/{{SCHEDULE_ID}}"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "type": "now"
    }
    """

  Scenario: List of schedules for admin
    When I send a GET request to "/api/admin/schedule/list"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "page": 1,
      "total": 1,
      "schedules": [
        {
          "type": "now"
        }
      ]
    }
    """

  Scenario: List of schedules for admin with filters
    When I send a GET request to "/api/admin/schedule/list?limit=10&page=1&campaignIds={{CAMPAIGN_ID}}&projection=type campaign"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "page": 1,
      "total": 1,
      "schedules": [
        {
          "campaign": "{{CAMPAIGN_ID}}",
          "type": "now"
        }
      ]
    }
    """

  Scenario: Create a schedule for admin
    When I send a POST request to "/api/admin/schedule/{{CAMPAIGN_ID}}" with json:
    """
    {
      "type": "now",
      "date": "2022-05-03",
      "interval": {
        "number": 123,
        "type": "week"
      },
      "recurring": {
        "fulfill": 123,
        "target": 2
      }
    }
    """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
    """
    {
      "type": "now",
      "date": "2022-05-03T00:00:00.000Z",
      "interval": {
        "number": 123,
        "type": "week"
      },
      "recurring": {
        "fulfill": 123,
        "target": 2
      }
    }
    """

  Scenario: Update a schedule for admin
    When I send a PATCH request to "/api/admin/schedule/{{SCHEDULE_ID}}" with json:
    """
    {
      "type": "periodicAfterDate"
    }
    """
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "type": "periodicAfterDate"
    }
    """

  Scenario: Delete a schedule for admin
    When I send a GET request to "/api/admin/schedule/{{SCHEDULE_ID}}"
    Then the response status code should be 200
    When I send a DELETE request to "/api/admin/schedule/{{SCHEDULE_ID}}"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "type": "now"
    }
    """
    When I send a GET request to "/api/admin/schedule/{{SCHEDULE_ID}}"
    Then the response status code should be 404
