Feature: employee
  Background:
    Given I use DB fixture "users"
    Given I use DB fixture "groups"
    Given I use DB fixture "trusted-domain"
    Given I use DB fixture "business"
    And I remember as "businessId" following value:
      """
      "74b58859-3a62-4b63-83d6-cc492b2c8e29"
      """
    And I remember as "businessId2" following value:
      """
      "74b58859-3a62-4b63-83d6-cc492b2c8e31"
      """
    And I remember as "businessId3" following value:
      """
      "f2441a44-e7d3-4bf2-8246-03395f0df178"
      """
    And I remember as "userId" following value:
      """
      "09d1fdca-f692-4609-bc2d-b3003a24c30a"
      """
    And I authenticate as a user with the following data:
      """
      {
        "id": "b5965f9d-5971-4b02-90eb-537a0a6e07c7",
        "email": "merchant@example.com",
        "roles": [
          {"name": "user", "permissions": []},
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "{{businessId}}",
                "acls": []
              },
              {
                "businessId": "{{businessId2}}",
                "acls": []
              },
              {
                "businessId": "{{businessId3}}",
                "acls": []
              }
            ]
          }
        ]
      }
      """

  Scenario: get acls
    When I send a GET request to "/api/employees/business/{{businessId}}/get-acls/09d1fdca-f692-4609-bc2d-b3003a24c30b"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    {
      "acls": [],
      "positions": [
        {
          "businessId": "{{businessId}}",
          "positionType": "Cashier",
          "status": 2
        },
        {
          "businessId": "74b58859-3a62-4b63-83d6-cc492b2c8e30",
          "positionType": "Cashier",
          "status": 1
        }
      ]
    }
    """

  Scenario: get acls by user
    When I send a GET request to "/api/employees/business/{{businessId}}/get-acls-by-user/{{userId}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    {
      "acls": [
        {
          "create": true,
          "microservice": "mail"
        }
      ],
      "employee": {
        "_id": "09d1fdca-f692-4609-bc2d-b3003a24c30a",
        "email": "rob@intveld.com",
        "firstName": "Rob",
        "isActive": false,
        "isVerified": false,
        "lastName": "Intveld",
        "userId": "09d1fdca-f692-4609-bc2d-b3003a24c30a",
        "fullName": "Rob Intveld",
        "id": "09d1fdca-f692-4609-bc2d-b3003a24c30a"
      }
    }
    """

  Scenario: get acls by user not found
    When I send a GET request to "/api/employees/business/{{businessId}}/get-acls-by-user/{{userId}}-invalid-id"
    Then print last response
    And the response status code should be 404

  Scenario: create employee By id
    When I send a POST request to "/api/employees/business/74b58859-3a62-4b63-83d6-cc492b2c8e29/employee/id" with json:
    """
    {
        "status": 1,
        "email": "testtegea@testdomen.in",
        "position": "Admin",
        "groups": null,
        "acls": [
          {
            "microservice": "statistics",
            "create": false,
            "read": false,
            "update": false,
            "delete": false
          }
        ],
        "phoneNumber": null,
        "companyName": "Comp"
    }
    """
    And print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "_id": "*",
      "isVerified": false,
      "email": "testtegea@testdomen.in",
      "permissions": [
        {
          "acls": [
            {
              "microservice": "statistics",
              "create": false,
              "read": false,
              "update": false,
              "delete": false
            }
          ],
          "businessId": "{{businessId}}"
        }
      ],
      "positions": [
        {
          "businessId": "{{businessId}}",
          "positionType": "Admin",
          "status": 1
        }
      ],
      "id": "*"
    }
    """

  Scenario: get acls
    When I send a GET request to "/api/employees/groups/get-acls/bf088c5a-55d9-4945-a1b7-3d5893c54210"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    [
        {"microservice":"pos","create":true,"read":true,"update":true,"delete":true}
    ]
    """


  Scenario: employee registration endpoint -- verified domain
    Given generating new encrypted string using password "Schladdi121@" and remember as "password"
    When I send a POST request to "/api/employee/register/{{businessId3}}" with json:
    """
    {
       "email": "test@domain.com",
       "firstName": "Test",
       "lastName": "Test",
       "password": "{{password}}"
    }
    """

    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    {
      "accessToken": "*",
      "refreshToken": "*",
      "isDomainTrusted": true
    }
    """
    And print RabbitMQ exchange "async_events" message list
    And the RabbitMQ exchange "async_events" should contain following messages:
    """
    [
      {
        "name": "auth.event.employee.register",
        "payload": {
          "businessId": "{{businessId3}}",
          "employee": {
            "email": "test@domain.com"
          }
        }
      }
    ]
    """

   Scenario: employee registration endpoint -- not verified domain
    Given generating new encrypted string using password "Schladdi121@" and remember as "password"
    When I send a POST request to "/api/employee/register/{{businessId3}}" with json:
    """
    {
       "email": "test@gmail.com",
       "firstName": "Test",
       "lastName": "Test",
       "password": "{{password}}"
    }
    """

    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    {
      "accessToken": "*",
      "refreshToken": "*",
      "isDomainTrusted": false
    }
    """
    And print RabbitMQ exchange "async_events" message list
    And the RabbitMQ exchange "async_events" should contain following messages:
    """
    [
      {
        "name": "auth.event.employee.register",
        "payload": {
          "businessId": "{{businessId3}}",
          "employee": {
            "email": "test@gmail.com"
          }
        }
      }
    ]
    """


  Scenario: Get employees that need approval
    When I send a GET request to "/api/employees/business/{{businessId2}}/need-approval"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    [
      {
        "_id": "09d1fdca-f692-4609-bc2d-b3003a24c30b"
      }
    ]
    """

  Scenario: Approve employee
    When I send a PATCH request to "/api/employees/business/{{businessId2}}/approve/employee/09d1fdca-f692-4609-bc2d-b3003a24c30b"
    Then print last response
    And the response status code should be 200
    And look for model "Employee" by following JSON and remember as "employee":
      """
      { "_id": "09d1fdca-f692-4609-bc2d-b3003a24c30b" }
      """
    And stored value "employee" should contain json:
      """
      {
        "positions": [
          {
            "businessId": "{{businessId2}}",
            "status": 2
          }
        ]
      }
      """
    And the RabbitMQ exchange "async_events" should contain following messages:
    """
    [
      {
        "name": "users.event.employee.verify",
        "payload": {
          "businessId": "{{businessId2}}",
          "employee": {
            "email": "rob2@intveld.com"
          }
        }
      }
    ]
    """

  Scenario: Reject employee
    When I send a PATCH request to "/api/employees/business/{{businessId2}}/reject/employee/09d1fdca-f692-4609-bc2d-b3003a24c30b"
    Then print last response
    And the response status code should be 200
    And look for model "Employee" by following JSON and remember as "employee":
      """
      { "_id": "09d1fdca-f692-4609-bc2d-b3003a24c30b" }
      """
    And stored value "employee" should contain json:
      """
      {
        "positions": []
      }
      """
    And print RabbitMQ exchange "async_events" message list
    And the RabbitMQ exchange "async_events" should contain following messages:
    """
    [
      {
        "name": "auth.event.employee.removed.synced",
        "payload": {
          "businessId": "{{businessId2}}",
          "employeeId": "09d1fdca-f692-4609-bc2d-b3003a24c30b",
          "userId": "09d1fdca-f692-4609-bc2d-b3003a24c30b"
        }
      }
    ]
    """
