Feature: Admin
  Background:
    Given I remember as "businessId" following value:
      """
      "6502b371-4cda-4f1d-af9c-f9c5c886c455"
      """
    Given I remember as "businessIdTwo" following value:
      """
      "88038e2a-90f9-11e9-a492-7200004fe4c0"
      """
    Given I remember as "userId" following value:
      """
      "8a13bd00-90f1-11e9-9f67-7200004fe4c0"
      """
    Given I remember as "userOwnedBusinessId" following value:
      """
      "88038e2a-90f9-11e9-a492-7200004fe4c0"
      """
    Given I use DB fixture "employee"
    Given I mock RPC request "users.rpc.employee.created" to "users.rpc.employee.created" with:
      """
      {
        "requestPayload": "*",
        "responsePayload": [{ "success": true }]
      }
      """

  Scenario: get users list for admin
    Given I use DB fixture "users"
    Given I authenticate as a user with the following data:
    """
      {
        "email": "email@test.com",
        "id": "85547e38-dfe5-4282-b1ae-c5542267f39e",
        "roles": [{
          "name": "admin"
        }]
      }
    """
    When I send a GET request to "/admin/users"
    Then print last response
    Then response status code should be 200
    And response should contain json:
    """
    {
      "users": [
        {
          "_id": "8a13bd00-90f1-11e9-9f67-7200004fe4c0"
        },
        {
          "_id": "85547e38-dfe5-4282-b1ae-c5542267f39e"
        }
      ],
      "page": 1,
      "total": 8
    }
    """

  Scenario: delete user
    Given I use DB fixture "users"
    Given I use DB fixture "businesses"
    Given I authenticate as a user with the following data:
    """
      {
        "email": "email@test.com",
        "id": "85547e38-dfe5-4282-b1ae-c5542267f39e",
        "roles": [{
          "name": "admin"
        }]
      }
    """
    When I send a DELETE request to "/admin/users/{{userId}}"

    Then print last response
    And the response status code should be 200

    And the response should contain json:
    """
      {
        "_id": "{{userId}}"
      }
    """
    And model "User" with id "{{userId}}" should not exist

    And RabbitMQ exchange "async_events" should contain following messages:
    """
    [
      {
        "name": "users.event.user.removed",
        "payload": {
          "_id": "{{userId}}"
        }
      }
    ]
    """

  Scenario: delete user with it's owned businesses
    Given I use DB fixture "users"
    Given I use DB fixture "businesses"
    Given I authenticate as a user with the following data:
    """
      {
        "email": "email@test.com",
        "id": "85547e38-dfe5-4282-b1ae-c5542267f39e",
        "roles": [{
          "name": "admin"
        }]
      }
    """
    When I send a DELETE request to "/admin/users/{{userId}}" with json:
    """
      {
        "deleteOwnBusinesses": true
      }
    """

    Then print last response
    And the response status code should be 200

    And the response should contain json:
    """
      {
        "_id": "{{userId}}"
      }
    """
    And model "User" with id "{{userId}}" should not exist

    Then print RabbitMQ exchange "async_events" message list
    And RabbitMQ exchange "async_events" should contain following messages:
    """
    [
      {
        "name": "users.event.user.removed",
        "payload": {
          "_id": "{{userId}}"
        }
      }
    ]
    """
    And RabbitMQ exchange "async_events" should contain following messages:
    """
    [
      {
        "name": "users.event.business.removed",
        "payload": {
          "_id": "{{userOwnedBusinessId}}"
        }
      }
    ]
    """

    When I send a GET request to "/business/{{userOwnedBusinessId}}"
    Then print last response
    Then the response status code should be 404

  Scenario: update user
    Given I use DB fixture "users"
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "users",
          {
            "_id":"{{userId}}"
          }
         ],
        "result": {}
      }
      """
    When I send a PATCH request to "/admin/users/{{userId}}" with json:
    """
      {
        "logo": "new"
      }
    """
    Then print last response
    Then the response status code should be 200

    When I send a GET request to "/admin/users/{{userId}}"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "businesses": [],
      "_id": "8a13bd00-90f1-11e9-9f67-7200004fe4c0",
      "userAccount": {
        "_id": "*",
        "shippingAddresses": [],
        "language": "en",
        "salutation": "test",
        "firstName": "test",
        "lastName": "test",
        "phone": "test",
        "email": "email@test.com",
        "logo": "new"
      }
    }
    """

  Scenario: Get employee
    When I send a GET request to "/admin/employees/{{businessIdTwo}}?page=1&limit=1"
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "count": 7,
        "data": [
          {
            "_id": "8a13bd00-90f1-11e9-9f67-7200004fe4c2",
            "email": "email@test.com",
            "positions": [
              {
                "businessId": "88038e2a-90f9-11e9-a492-7200004fe4c0",
                "status": 1,
                "positionType": "Admin"
              }
            ],
            "email_i": "email@test.com",
            "status": "1",
            "nameAndEmail": "email@test.com"
          }
        ]
      }
      """

  Scenario: Get employee By id
    When I send a GET request to "/admin/employees/{{businessIdTwo}}/8a13bd00-90f1-11e9-9f67-7200004fe4c2"
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
        {
          "data": {
            "_id": "8a13bd00-90f1-11e9-9f67-7200004fe4c2",
            "email": "email@test.com",
            "userId": "8a13bd00-90f1-11e9-9f67-7200004fe4c1",
            "positions": [
              {
                "businessId": "88038e2a-90f9-11e9-a492-7200004fe4c0",
                "status": 1,
                "positionType": "Admin"
              }
            ]
          }
        }
      """

  Scenario: Get employee By id
    When I send a GET request to "/admin/employees/{{businessIdTwo}}/count?email=email@test.com"
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
       1
      """

  Scenario: update employee By id
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@email.com",
        "roles": [
          {
            "name": "admin",
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
    When I send a PATCH request to "/admin/employees/{{businessIdTwo}}/2a13bd00-90f1-11e9-9f67-7200003f86c9" with json:
      """
        {
          "status": 1,
          "firstName": "Admin",
          "lastName": "test curl",
          "email": "testtegea@testdomen.in",
          "position": "Admin"
        }
      """
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
        {
          "_id": "2a13bd00-90f1-11e9-9f67-7200003f86c9",
          "email": "testtegea@testdomen.in",
          "positions": [
          {
            "businessId": "88038e2a-90f9-11e9-a492-7200004fe4c0",
            "status": 1,
            "positionType": "Admin"
          }
        ],
          "firstName": "Admin",
          "lastName": "test curl",
          "fullName": "Admin test curl"
        }
      """

  Scenario: update own employee By id
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "roles": [
          {
            "name": "admin",
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
    When I send a PATCH request to "/admin/employees/{{businessIdTwo}}/8a13bd00-90f1-11e9-9f67-7200004fe4c2" with json:
      """
        {
          "status": 1,
          "firstName": "Admin",
          "lastName": "test curl",
          "email": "testtegea@testdomen.in",
          "position": "Admin"
        }
      """
    And print last response
    Then the response status code should be 400
    And the response should contain json:
      """
        {
          "errors": "You attempted to modify your own information/permissions, which is not allowed.",
          "message": "Validation failed",
          "statusCode": 400
        }
      """

  Scenario: update employee By id
    When I send a POST request to "/admin/employees/{{businessIdTwo}}" with json:
    """
    {
      "logo": null,
      "status": 1,
      "firstName": "Admin",
      "lastName": "test curl",
      "email": "Testtegea@testdomen.in",
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
      "companyName": "Comp",
      "address": {
        "country": null,
        "city": null,
        "state": null,
        "street": null,
        "zipCode": null
      }
    }
    """
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
        {
          "isVerified": false,
          "logo": null,
          "firstName": "Admin",
          "lastName": "test curl",
          "email": "testtegea@testdomen.in",
          "phoneNumber": null,
          "companyName": "Comp",
          "address": {
            "country": null,
            "city": null,
            "state": null,
            "street": null,
            "zipCode": null
          },
          "positions": [
            {
              "businessId": "88038e2a-90f9-11e9-a492-7200004fe4c0",
              "positionType": "Admin",
              "status": 1
            }
          ],
          "_id": "*",
          "fullName": "Admin test curl",
          "id": "*"
        }
      """

  Scenario: delete employee By id
    When I send a DELETE request to "/admin/employees/{{businessIdTwo}}/8a13bd00-90f1-11e9-9f67-7200004fe4c2"
    And print last response
    Then the response status code should be 200
