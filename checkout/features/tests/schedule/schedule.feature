Feature: Schedule management api
  Background:
    Given I remember as "businessId" following value:
    """
    "012c165f-8b88-405f-99e2-82f74339a757"
    """
    Given I remember as "scheduleId" following value:
    """
    "23e03d97-7ad8-4b16-ae32-51734cea5edd"
    """
    Given I authenticate as a user with the following data:
    """
      {
        "id": "2673fa45-82b9-484c-bcbe-46da250c2639",
        "email": "testcases@payever.de",
        "firstName": "Test",
        "lastName": "Test",
        "roles": [
          {
            "name": "oauth",
            "permissions": [
              {
                "acls": [],
                "businessId": "{{businessId}}"
              }
            ]
          }
        ]
      }
    """

  Scenario: Get all business schedules
    Given I use DB fixture "schedule/list"
    When I send a GET request to "/api/schedule"
    Then print last response
    And the response status code should be 200
    And response should contain json:
    """
    [
       {
         "_id": "23e03d97-7ad8-4b16-ae32-51734cea5edd",
         "task": "payment_link_reminder",
         "duration": {
            "type": "every",
            "unit": "day",
            "period": 5
         },
         "enabled": true
       },
       {
         "_id": "5b716205-265e-4a6e-8e3d-cbc350d9ef31",
         "task": "payment_link_reminder",
         "duration": {
            "type": "every",
            "unit": "day",
            "period": 5
         },
         "enabled": true
       }
    ]
    """

  Scenario: Get schedule by id
    Given I use DB fixture "schedule/get-by-id"
    When I send a GET request to "/api/schedule/{{scheduleId}}"
    Then print last response
    And the response status code should be 200
    And response should contain json:
    """
    {
      "_id": "{{scheduleId}}",
      "task": "payment_link_reminder",
      "duration": {
        "type": "every",
        "unit": "day",
        "period": 5
      },
      "enabled": true
    }
    """

  Scenario: Enable and disable schedule
    Given I use DB fixture "schedule/disabled"
    When I send a PATCH request to "/api/schedule/{{scheduleId}}/enable"
    Then print last response
    And the response status code should be 200
    And response should contain json:
    """
    {
      "_id": "{{scheduleId}}",
      "task": "payment_link_reminder",
      "duration": {
        "type": "every",
        "unit": "day",
        "period": 5
      },
      "enabled": true
    }
    """
    And I send a PATCH request to "/api/schedule/{{scheduleId}}/disable"
    Then print last response
    And the response status code should be 200
    And response should contain json:
    """
    {
      "_id": "{{scheduleId}}",
      "task": "payment_link_reminder",
      "duration": {
        "type": "every",
        "unit": "day",
        "period": 5
      },
      "enabled": false
    }
    """

  Scenario: Create scheduled payment_action for payment method
    When I send a POST request to "/api/schedule" with json:
    """
    {
      "task": "payment_action",
      "duration": {
        "type": "every",
        "unit": "day",
        "period": 5
      },
      "action": "cancel",
      "payment_method": "santander_installment",
      "enabled": true,
      "filter": {
        "date_gt": "2024-04-29T00:00:00.000Z",
        "date_lt": "2024-05-29T00:00:00.000Z",
        "status": "STATUS_IN_PROCESS",
        "specific_status": "IN_PROGRESS",
        "total_gt": 1000,
        "total_lt": 2000
      },
      "payload": {
        "reason": "full cancel"
      },
      "start_date": "2024-04-29T00:00:00.000Z",
      "end_date": "2024-05-29T00:00:00.000Z"
    }
    """
    Then print last response
    And the response status code should be 201
    And response should contain json:
    """
    {
      "_id": "*",
      "task": "payment_action",
      "duration": {
        "type": "every",
        "unit": "day",
        "period": 5
      },
      "action": "cancel",
      "payment_method": "santander_installment",
      "payload": {
        "reason": "full cancel"
      },
      "enabled": true,
      "filter": {
         "date_gt": "2024-04-29T00:00:00.000Z",
         "date_lt": "2024-05-29T00:00:00.000Z",
         "status": "STATUS_IN_PROCESS",
         "specific_status": "IN_PROGRESS",
         "total_gt": 1000,
         "total_lt": 2000
      },
      "start_date": "2024-04-29T00:00:00.000Z",
      "end_date": "2024-05-29T00:00:00.000Z"
    }
    """

  Scenario: Create scheduled payment_action for specific payment_id
    When I send a POST request to "/api/schedule" with json:
    """
    {
      "task": "payment_action",
      "duration": {
        "type": "once",
        "unit": "day",
        "period": 5
      },
      "action": "cancel",
      "payment_id": "12345",
      "enabled": true,
      "filter": {
        "status": "STATUS_IN_PROCESS",
        "specific_status": "IN_PROGRESS"
      },
      "payload": {
        "reason": "full cancel"
      }
    }
    """
    Then print last response
    And the response status code should be 201
    And response should contain json:
    """
    {
      "_id": "*",
      "task": "payment_action",
      "duration": {
        "type": "once",
        "unit": "day",
        "period": 5
      },
      "action": "cancel",
      "payment_id": "12345",
      "payload": {
        "reason": "full cancel"
      },
      "enabled": true,
      "filter": {
         "status": "STATUS_IN_PROCESS",
         "specific_status": "IN_PROGRESS"
      }
    }
    """

  Scenario: Update schedule
    Given I use DB fixture "schedule/update-by-id"
    When I send a PUT request to "/api/schedule/{{scheduleId}}" with json:
    """
    {
      "task": "payment_action",
      "duration": {
        "type": "every",
        "unit": "day",
        "period": 5
      },
      "action": "cancel",
      "payment_method": "santander_installment",
      "enabled": true,
      "filter": {
        "status": "STATUS_IN_PROCESS",
        "specific_status": "IN_PROGRESS",
        "total_gt": 1000,
        "total_lt": 2000
      },
      "payload": {
        "reason": "full cancel"
      }
    }
    """
    Then print last response
    And the response status code should be 200
    And response should contain json:
    """
    {
      "_id": "*",
      "task": "payment_action",
      "duration": {
        "type": "every",
        "unit": "day",
        "period": 5
      },
      "action": "cancel",
      "payment_method": "santander_installment",
      "payload": {
        "reason": "full cancel"
      },
      "enabled": true,
      "filter": {
         "status": "STATUS_IN_PROCESS",
         "specific_status": "IN_PROGRESS",
         "total_gt": 1000,
         "total_lt": 2000
      }
    }
    """

  Scenario: Delete schedule
    Given I use DB fixture "schedule/delete-by-id"
    When I send a DELETE request to "/api/schedule/{{scheduleId}}"
    Then print last response
    And the response status code should be 200
    And model "Schedule" with id "{{scheduleId}}" should not exist
