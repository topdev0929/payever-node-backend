Feature: Employee controller
  Background: 
    Given I remember as "businessId" following value:
      """
      "8a13bd00-90f1-11e9-9f67-7200004fe4c0"
      """
    Given I remember as "employeeId" following value:
      """
      "8a13bd00-90f1-11e9-9f67-7200004fe4c2"
      """
    Given I remember as "groupIdd" following value:
      """
      "88038e2a-90f9-11e9-a492-7200004fe4c4"
      """
    Given I use DB fixture "employee"
    Given I use DB fixture "group"
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "id": "8a13bd00-90f1-11e9-9f67-7200004fe4c0",
        "roles": [
          {
            "name": "user",
            "permissions": [{"businessId": "8a13bd00-90f1-11e9-9f67-7200004fe4c0", "acls": []}]
          },
          {
            "name": "merchant",
            "permissions": [{"businessId": "8a13bd00-90f1-11e9-9f67-7200004fe4c0", "acls": []}]
          }
        ]
      }
      """

  Scenario: Get group
    When I send a GET request to "/employee-groups/{{businessId}}?page=1&limit=1"
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
        {
           "count": 1,
           "data": [
             {
               "employees": [
                 "8a13bd00-90f1-11e9-9f67-7200004fe4c2"
               ],
               "_id": "8a13bd00-90f1-11e9-9f67-7200004fe4c4",
               "businessId": "8a13bd00-90f1-11e9-9f67-7200004fe4c0",
               "name": "test"
             }
           ]
         }
      """

  Scenario: Get employee By id
    When I send a GET request to "/employee-groups/{{businessId}}/8a13bd00-90f1-11e9-9f67-7200004fe4c4"
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
        {
           "employees": [
             {
               "_id": "8a13bd00-90f1-11e9-9f67-7200004fe4c2",
               "email": "email@test.com",
               "status": 1
             }
           ],
           "_id": "8a13bd00-90f1-11e9-9f67-7200004fe4c4",
           "businessId": "8a13bd00-90f1-11e9-9f67-7200004fe4c0",
           "name": "test"
         }
      """

  Scenario: Get employee By id
    When I send a GET request to "/employee-groups/{{businessId}}/count?groupName=test"
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
       1
      """

  Scenario: update employee By id
    When I send a PATCH request to "/employee-groups/{{businessId}}/8a13bd00-90f1-11e9-9f67-7200004fe4c4" with json:
    """
    {
        "name": "Admin"
    }
    """
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
        {
           "employees": [
             "8a13bd00-90f1-11e9-9f67-7200004fe4c2"
           ],
           "_id": "8a13bd00-90f1-11e9-9f67-7200004fe4c4",
           "businessId": "8a13bd00-90f1-11e9-9f67-7200004fe4c0",
           "name": "Admin"
        }
      """

  Scenario: update employee By id
    When I send a POST request to "/employee-groups/{{businessId}}" with json:
    """
    {
        "name": "Admin"
    }
    """
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
        {
           "employees": [],
           "businessId": "8a13bd00-90f1-11e9-9f67-7200004fe4c0",
           "name": "Admin"
         }
      """

  Scenario: delete employee By id
    When I send a DELETE request to "/employee-groups/{{businessId}}/8a13bd00-90f1-11e9-9f67-7200004fe4c4"
    And print last response
    Then the response status code should be 200

  Scenario: add employee By id
    When I send a POST request to "/employee-groups/{{businessId}}/8a13bd00-90f1-11e9-9f67-7200004fe4c4/add-employees" with json:
    """
    {
        "employees": ["{{employeeId}}"]
    }
    """
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
        {
           "employees": [
             "8a13bd00-90f1-11e9-9f67-7200004fe4c2"
           ],
           "_id": "8a13bd00-90f1-11e9-9f67-7200004fe4c4",
           "businessId": "8a13bd00-90f1-11e9-9f67-7200004fe4c0",
           "name": "test"
         }
      """

  Scenario: remove employee By id
    When I send a POST request to "/employee-groups/{{businessId}}/8a13bd00-90f1-11e9-9f67-7200004fe4c4/remove-employees" with json:
    """
    {
        "employees": ["{{employeeId}}"]
    }
    """
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
        {
           "employees": [],
           "_id": "8a13bd00-90f1-11e9-9f67-7200004fe4c4",
           "businessId": "8a13bd00-90f1-11e9-9f67-7200004fe4c0",
           "name": "test"
         }
      """

  Scenario: Create group
    When I publish in RabbitMQ channel "async_events_users_micro" message with json:
      """
      {
        "name": "auth.event.group.trusted-domain-created",
        "payload": {
          "_id": "test",
          "businessId": "test"
        }
      }
      """
    And I process messages from RabbitMQ "async_events_users_micro" channel
    Then I look for model "Groups" by following JSON and remember as "group":
      """
      {
        "_id": "test"
      }
      """
    And stored value "group" should contain json:
      """
      {
        "_id": "test",
        "businessId": "test"
      }
      """
