Feature: Schedule validation
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

  Scenario: Create schedule with empty data
    When I send a POST request to "/api/schedule" with json:
    """
    {}
    """
    Then print last response
    And the response status code should be 400
    And response should contain json:
    """
    {
      "statusCode": 400,
      "message": [
       {
         "property": "task",
         "children": [],
         "constraints": {
           "isEnum": "task must be a valid enum value",
           "isNotEmpty": "task should not be empty"
         }
       },
       {
         "property": "duration",
         "children": [],
         "constraints": {
           "isNotEmpty": "duration should not be empty"
         }
       }
      ],
      "error": "Bad Request"
    }
    """

  Scenario: Create schedule with empty data for task = payment_action
    When I send a POST request to "/api/schedule" with json:
    """
    {
      "task": "payment_action"
    }
    """
    Then print last response
    And the response status code should be 400
    And response should contain json:
    """
    {
       "statusCode": 400,
       "message": [
         {
           "property": "duration",
           "children": [],
           "constraints": {
             "isNotEmpty": "duration should not be empty"
           }
         },
         {
           "property": "action",
           "children": [],
           "constraints": {
             "isNotEmpty": "action should not be empty",
             "isEnum": "action must be a valid enum value"
           }
         },
         {
           "property": "payment_method",
           "children": [],
           "constraints": {
             "isNotEmpty": "payment_method should not be empty",
             "isString": "payment_method must be a string"
           }
         },
         {
           "property": "payment_id",
           "children": [],
           "constraints": {
             "isNotEmpty": "payment_id should not be empty",
             "isString": "payment_id must be a string"
           }
         }
       ],
       "error": "Bad Request"
     }
    """

  Scenario: Create schedule with empty data for task = payment_link_reminder
    When I send a POST request to "/api/schedule" with json:
    """
    {
      "task": "payment_link_reminder"
    }
    """
    Then print last response
    And the response status code should be 400
    And response should contain json:
    """
    {
       "statusCode": 400,
       "message": [
         {
           "property": "duration",
           "children": [],
           "constraints": {
             "isNotEmpty": "duration should not be empty"
           }
         }
       ],
       "error": "Bad Request"
     }
    """
