Feature: employee invitation
  Background:
    Given I use DB fixture "business"
    Given I use DB fixture "users"
    And I use DB fixture "groups"
    And I remember as "businessId" following value:
    """
    "74b58859-3a62-4b63-83d6-cc492b2c8e30"
    """
    And I remember as "userId" following value:
    """
    "09d1fdca-f692-4609-bc2d-b3003a24c30b"
    """
    And I authenticate as a user with the following data:
      """
      {
        "id": "b5965f9d-5971-4b02-90eb-537a0a6e07c7",
        "email": "merchant@example.com",
        "roles": [
          {"name": "user", "permissions": []},
          {"name": "admin", "permissions": []},
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "74b58859-3a62-4b63-83d6-cc492b2c8e29",
                "acls": []
              }
            ]
          }
        ]
      }
      """

  Scenario: invite employee admin api
    When I send a PATCH request to "/api/employees/invite"
    Then print last response
    And the response status code should be 200
    And print RabbitMQ exchange "async_events" message list
    And the RabbitMQ exchange "async_events" should contain following messages:
    """
    [
      {
        "name": "payever.event.business.email",
        "payload": {
          "businessId": "74b58859-3a62-4b63-83d6-cc492b2c8e30",
          "locale": "business",
          "subject": "",
          "templateName": "staff_invitation_new",
          "to": "*",
          "variables": {
            "staff_invitation": {
              "link": "*"
            }
          }
        }
      }
    ]
    """

  Scenario: invite employee via api
    When I send a PATCH request to "/api/employees/invite/{{businessId}}/{{userId}}"
    Then print last response
    And the response status code should be 200
    And print RabbitMQ exchange "async_events" message list
    And the RabbitMQ exchange "async_events" should contain following messages:
    """
    [
      {
        "name": "payever.event.business.email",
        "payload": {
          "businessId": "74b58859-3a62-4b63-83d6-cc492b2c8e30",
          "locale": "business",
          "subject": "",
          "templateName": "staff_invitation_new",
          "to": "*",
          "variables": {
            "staff_invitation": {
              "link": "*&email=rob2@intveld.com&firstName=Rob&lastName=Intveld"
            }
          }
        }
      }
    ]
    """

  Scenario: invite employee owner api -- dry run
    When I send a POST request to "/api/employees/owner-invite" with json:
    """
    {
      "dryRun": true
    }
    """
    Then print last response
    And the response status code should be 200
    And print RabbitMQ exchange "async_events" message list
    And the RabbitMQ exchange "async_events" should not contain following messages:
    """
    [
      {
        "name": "payever.event.business.email",
        "payload": {
          "businessId": "74b58859-3a62-4b63-83d6-cc492b2c8e29",
          "locale": "business",
          "subject": "",
          "templateName": "staff_invitation_new",
          "to": "*",
          "variables": {
            "staff_invitation": {
              "link": "*"
            }
          }
        }
      },
      {
        "name": "users.event.employee.invite",
        "payload": {
          "businessId": "74b58859-3a62-4b63-83d6-cc492b2c8e29",
          "employee": {
            "_id": "787e4b36-ecfa-4e86-a915-d06fb21t4ed3",
            "email": "robb2@intveld.com",
            "firstName": "Rob",
            "isActive": false,
            "isVerified": false,
            "lastName": "Intveld"
          }
        }
      }
    ]
    """

  Scenario: invite employee owner api
    When I send a POST request to "/api/employees/owner-invite"
    Then print last response
    And the response status code should be 200
    And print RabbitMQ exchange "async_events" message list
    And the RabbitMQ exchange "async_events" should contain following messages:
    """
    [
      {
        "name": "payever.event.business.email",
        "payload": {
          "businessId": "74b58859-3a62-4b63-83d6-cc492b2c8e29",
          "locale": "business",
          "subject": "",
          "templateName": "staff_invitation_new",
          "to": "*",
          "variables": {
            "staff_invitation": {
              "link": "*"
            }
          }
        }
      },
      {
        "name": "users.event.employee.invite",
        "payload": {
          "businessId": "74b58859-3a62-4b63-83d6-cc492b2c8e29",
          "employee": {
            "_id": "787e4b36-ecfa-4e86-a915-d06fb21t4ed3",
            "email": "robb2@intveld.com",
            "firstName": "Rob",
            "isActive": false,
            "isVerified": false,
            "lastName": "Intveld"
          }
        }
      }
    ]
    """

    Scenario: verify invitation endpoint -- registered employee
    When I send a GET request to "/api/employees/verify?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJvYkBpbnR2ZWxkLmNvbSIsImJ1c2luZXNzSWQiOiI3NGI1ODg1OS0zYTYyLTRiNjMtODNkNi1jYzQ5MmIyYzhlMjkiLCJpYXQiOjE1NjQ2NzM4NTAsImV4cCI6MjQyODY3Mzg1MH0.Szins6jlEgykfVpzk_jiMkSpATXPvOzyj4J9j1utKb8"

    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    {
      "accessToken": "*",
      "refreshToken": "*"
    }
    """
    And look for model "Employee" by following JSON and remember as "employee":
    """
    {
      "email": "rob@intveld.com"
    }
    """
    And stored value "employee" should contain json:
      """
      {
        "positions": [
          {
            "businessId": "74b58859-3a62-4b63-83d6-cc492b2c8e29",
            "positionType": "Cashier",
            "status": 2
          }
        ]
      }
      """
    And look for model "Permission" by following JSON and remember as "permissions":
    """
    {
      "businessId": "74b58859-3a62-4b63-83d6-cc492b2c8e29",
      "userId": "09d1fdca-f692-4609-bc2d-b3003a24c30a"
    }
    """

  Scenario: verify invitation endpoint -- not registered employee
    When I send a GET request to "/api/employees/verify?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJvYmIyQGludHZlbGQuY29tIiwiYnVzaW5lc3NJZCI6Ijc0YjU4ODU5LTNhNjItNGI2My04M2Q2LWNjNDkyYjJjOGUyOSIsImlhdCI6MTU2NDY3Mzg1MCwiZXhwIjoyNDI4NjczODUwfQ.jn05G7Gk8m_457Sp74jqcTJdwrkKhqpZXKAPdEX8AD8"

    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    {
      "accessToken": "",
      "isValid": true
    }
    """

  Scenario: confirm existed user in business
    When I send a POST request to "/api/employees/confirm/74b58859-3a62-4b63-83d6-cc492b2c8e30/09d1fdca-f692-4609-bc2d-b3003a24c30b" with json:
    """
    {
    }
    """

    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    {
      "accessToken": "*",
      "refreshToken": "*"
    }
    """
    And look for model "Employee" by following JSON and remember as "employee":
    """
    {
      "firstName": "Rob",
      "positions": {
        "businessId": "74b58859-3a62-4b63-83d6-cc492b2c8e30",
        "positionType": "Cashier",
        "status": 2
      }
    }
    """

  Scenario: return false if employee not registered
    When I send a GET request to "/api/employees/ac031fc5-43d8-4e17-a07b-daa1c3b8ea85/isRegistered"

    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
      false
    """

  Scenario: return true if employee registered
    When I send a GET request to "/api/employees/ac031fc5-43d8-4e17-a07b-daa1c3b8ea81/isRegistered"

    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
      true
    """

  Scenario: Employee registered and verified into business
    When I send a GET request to "/api/employees/invite-data/74b58859-3a62-4b63-83d6-cc492b2c8e29/09d1fdca-f692-4609-bc2d-b3003a24c30a"

    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
      {
        "isRegistered": true,
        "isVerifiedToBusiness": true
      }
    """

  Scenario: Employee registered but not verified into business
    When I send a GET request to "/api/employees/invite-data/74b58859-3a62-4b63-83d6-cc492b2c8e28/09d1fdca-f692-4609-bc2d-b3003a24c30a"

    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
      {
        "isRegistered": true,
        "isVerifiedToBusiness": false
      }
    """

  Scenario: Employee not registered and not verified into business
    When I send a GET request to "/api/employees/invite-data/74b58859-3a62-4b63-83d6-cc492b2c8e29/787e4b36-ecfa-4e86-a915-d06fb21t4ed3"

    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
      {
        "isRegistered": false,
        "isVerifiedToBusiness": false
      }
    """
