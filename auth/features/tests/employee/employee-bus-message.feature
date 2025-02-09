@employee
Feature: Employee
  Background:
    Given I use DB fixture "users"
    Given I use DB fixture "business"
    And I remember as "BUSINESS_2_ID" following value:
      """
      "532d6fba-6fb6-447d-b703-bf42e4361c1b"
      """
    And I remember as "BUSINESS_3_ID" following value:
      """
      "84b58859-3a62-4b63-83d6-cc492b2c8e29"
      """
    And I remember as "BUSINESS_4_ID" following value:
      """
      "74b58859-3a62-4b63-83d6-cc492b2c8e29"
      """
    And I remember as "MERCHANT_USER_ID" following value:
      """
      "b5965f9d-5971-4b02-90eb-537a0a6e07c7"
      """
    And I authenticate as a user with the following data:
    """
    {
      "id": "b5965f9d-5971-4b02-90eb-537a0a6e07c7",
      "email": "merchant@example.com",
      "roles": [
      {
        "name": "user",
        "permissions": []
      },
      {
        "name": "merchant",
        "permissions": [{"businessId": "21e67ee2-d516-42e6-9645-46765eadd0ac", "acls": []}]
      }]
    }
    """

  Scenario: Create employee
    When I publish in RabbitMQ channel "async_events_auth_micro" message with json:
      """
      {
        "name": "users.event.employee.created",
        "payload": {
          "businessId": "74b58859-3a62-4b63-83d6-cc492b2c8e29",
          "employee": {
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
          },
          "user": {
            "id": "b5965f9d-5971-4b02-90eb-537a0a6e07c7",
            "email": "merchant@example.com"
          },
          "id": "id",
          "shouldInvite": true
        }
      }
      """
    And I process messages from RabbitMQ "async_events_auth_micro" channel
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
      }
    ]
    """

   Scenario: RPC Create employee
    When I publish in RabbitMQ channel "async_events_auth_micro" message with json:
      """
      {
        "name": "users.rpc.employee.created",
        "payload": {
          "businessId": "74b58859-3a62-4b63-83d6-cc492b2c8e29",
          "employee": {
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
          },
          "user": {
            "id": "b5965f9d-5971-4b02-90eb-537a0a6e07c7",
            "email": "merchant@example.com"
          },
          "id": "id",
          "shouldInvite": true
        }
      }
      """
    And I process messages from RabbitMQ "async_events_auth_micro" channel
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
      }
    ]
    """

  Scenario: Resend employee invite
    When I publish in RabbitMQ channel "async_events_auth_micro" message with json:
      """
      {
        "name": "users.event.employee.resend-invite",
        "payload": {
          "businessId": "74b58859-3a62-4b63-83d6-cc492b2c8e29",
          "employee": {
            "email": "robb2@intveld.com"
          },
          "user": {
            "id": "b5965f9d-5971-4b02-90eb-537a0a6e07c7",
            "email": "merchant@example.com"
          }
        }
      }
      """
    And I process messages from RabbitMQ "async_events_auth_micro" channel
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
      }
    ]
    """

  Scenario: Delete employee
    When I publish in RabbitMQ channel "async_events_auth_micro" message with json:
      """
      {
        "name": "users.event.employee.removed",
        "payload": {
          "employee": {
            "email": "rob@intveld.com",
            "id": "09d1fdca-f692-4609-bc2d-b3003a24c30a"
          }
        }
      }
      """
    And I process messages from RabbitMQ "async_events_auth_micro" channel
    And model "Employee" with id "09d1fdca-f692-4609-bc2d-b3003a24c30a" should not exist

   Scenario: Remove business permission for an employee
    When I publish in RabbitMQ channel "async_events_auth_micro" message with json:
      """
      {
        "name": "users.event.employee.removed",
        "payload": {
          "businessId": "74b58859-3a62-4b63-83d6-cc492b2c8e29",
          "employee": {
            "email": "rob@intveld.com",
            "id": "09d1fdca-f692-4609-bc2d-b3003a24c30a"
          }
        }
      }
      """
    And I process messages from RabbitMQ "async_events_auth_micro" channel
    And look for model "Employee" by following JSON and remember as "employee":
      """
      { "_id": "09d1fdca-f692-4609-bc2d-b3003a24c30a" }
      """
    And stored value "employee" should contain json:
      """
      {
        "positions": [],
        "permissions": []
      }
      """

  Scenario: Remove business permission for an employee and add again
    When I publish in RabbitMQ channel "async_events_auth_micro" message with json:
      """
      {
        "name": "users.event.employee.removed",
        "payload": {
          "businessId": "74b58859-3a62-4b63-83d6-cc492b2c8e29",
          "employee": {
            "email": "newuser.test@test.com",
            "id": "303db8fd-b160-4cdd-949f-fa566c0a8aed",
            "positions":[
              {
                "businessId": "74b58859-3a62-4b63-83d6-cc492b2c8e29",
                "positionType": "Cashier",
                "status": 2
              }
            ]
          }
        }
      }
      """
    And I process messages from RabbitMQ "async_events_auth_micro" channel
    And print RabbitMQ exchange "async_events" message list
    And I publish in RabbitMQ channel "async_events_auth_micro" message with json:
      """
      {
        "name": "users.rpc.employee.created",
        "payload": {
          "businessId": "74b58859-3a62-4b63-83d6-cc492b2c8e29",
          "employee": {
            "firstName": "New Firstname Test",
            "lastName": "New Lastname Test",
            "status": 1,
            "email": "newuser.test@test.com",
            "position": "Cashier",
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
          },
           "user": {
            "id": "b5965f9d-5971-4b02-90eb-537a0a6e07c7",
            "email": "merchant@example.com"
          },
          "shouldInvite": true
        }
      }
      """
    And I process messages from RabbitMQ "async_events_auth_micro" channel
    And print RabbitMQ exchange "async_events" message list
    And look for model "Employee" by following JSON and remember as "employee":
      """
      { "_id": "303db8fd-b160-4cdd-949f-fa566c0a8aed" }
      """
    And stored value "employee" should contain json:
      """
      {
        "firstName": "New Firstname Test",
        "lastName": "New Lastname Test"
      }
      """

  Scenario: Record history on history sync event
    When I publish in RabbitMQ channel "async_events_auth_micro" message with json:
      """
      {
        "name": "users.event.employee.sync-history",
        "payload": {
          "employeeActivityHistory": {
            "businessId": "74b58859-3a62-4b63-83d6-cc492b2c8e29",
            "documentId": "employeeId",
            "field": "status",
            "value": 2,
            "by": "userId"
          }
        }
      }
      """
    And I process messages from RabbitMQ "async_events_auth_micro" channel
    Then model "EmployeeActivityHistory" found by following JSON should exist:
      """
      {
        "businessId": "74b58859-3a62-4b63-83d6-cc492b2c8e29",
        "documentId": "employeeId",
        "field": "status",
        "value": 2,
        "by": "userId"
      }
      """

  Scenario: Send invite email when status is changed to invited
    When I publish in RabbitMQ channel "async_events_auth_micro" message with json:
      """
      {
        "name": "users.event.employee.updated",
        "payload": {
          "businessId": "{{BUSINESS_3_ID}}",
          "employee": {
            "_id": "ac031fc5-43d8-4e17-a07b-daa1c3b8ea81",
            "id": "ac031fc5-43d8-4e17-a07b-daa1c3b8ea81",
            "email": "2fa@example.com",
            "firstName": "Test",
            "isActive": false,
            "isVerified": false,
            "lastName": "Test",
            "logo": "78ca2e67-4660-408b-9bf7-0687e9940208",
            "secondFactorRequired": false,
            "positions": [
              {
                "businessId": "74b58859-3a62-4b63-83d6-cc492b2c8e29",
                "positionType": "Cashier",
                "status": 2
              },
              {
                "businessId": "84b58859-3a62-4b63-83d6-cc492b2c8e29",
                "positionType": "Cashier",
                "status": 0
              }
            ]
          },
          "dto": {
            "status": 1,
            "position": "Cashier"
          },
          "confirmEmployee": false
        }
      }
      """
    And I process messages from RabbitMQ "async_events_auth_micro" channel
    Then print RabbitMQ exchange "async_events" message list
    And the RabbitMQ exchange "async_events" should contain following messages:
    """
    [
      {
        "name": "payever.event.business.email",
        "payload": {
          "templateName": "staff_invitation_new",
          "businessId": "{{BUSINESS_3_ID}}",
          "to": "2fa@example.com"
        }
      }
    ]
    """

  Scenario: Add/Remove business access when status is chagned to active/inactive
    When I publish in RabbitMQ channel "async_events_auth_micro" message with json:
      """
      {
        "name": "users.event.employee.updated",
        "payload": {
          "businessId": "{{BUSINESS_4_ID}}",
          "employee": {
            "_id": "ac031fc5-43d8-4e17-a07b-daa1c3b8ea81",
            "id": "ac031fc5-43d8-4e17-a07b-daa1c3b8ea81",
            "email": "2fa@example.com",
            "firstName": "Test",
            "isActive": false,
            "isVerified": false,
            "lastName": "Test",
            "logo": "78ca2e67-4660-408b-9bf7-0687e9940208",
            "secondFactorRequired": false,
            "positions": [
              {
                "businessId": "74b58859-3a62-4b63-83d6-cc492b2c8e29",
                "positionType": "Cashier",
                "status": 2
              },
              {
                "businessId": "84b58859-3a62-4b63-83d6-cc492b2c8e29",
                "positionType": "Cashier",
                "status": 0
              }
            ]
          },
          "dto": {
            "status": 0,
            "position": "Cashier"
          },
          "confirmEmployee": false
        }
      }
      """
    And I process messages from RabbitMQ "async_events_auth_micro" channel
    Then print RabbitMQ exchange "async_events" message list
    And the RabbitMQ exchange "async_events" should contain following messages:
    """
    [
      {
        "name": "auth.event.employee.removed.synced",
        "payload": {
          "businessId": "74b58859-3a62-4b63-83d6-cc492b2c8e29",
          "employeeId": "ac031fc5-43d8-4e17-a07b-daa1c3b8ea81",
          "userId": "ac031fc5-43d8-4e17-a07b-daa1c3b8ea81"
        }
      }
    ]
    """
    When I publish in RabbitMQ channel "async_events_auth_micro" message with json:
      """
      {
        "name": "users.event.employee.updated",
        "payload": {
          "businessId": "{{BUSINESS_4_ID}}",
          "employee": {
            "_id": "ac031fc5-43d8-4e17-a07b-daa1c3b8ea81",
            "id": "ac031fc5-43d8-4e17-a07b-daa1c3b8ea81",
            "email": "2fa@example.com",
            "firstName": "Test",
            "isActive": false,
            "isVerified": false,
            "lastName": "Test",
            "logo": "78ca2e67-4660-408b-9bf7-0687e9940208",
            "userId": "ac031fc5-43d8-4e17-a07b-daa1c3b8ea81",
            "secondFactorRequired": false,
            "positions": [
              {
                "businessId": "74b58859-3a62-4b63-83d6-cc492b2c8e29",
                "positionType": "Cashier",
                "status": 0
              },
              {
                "businessId": "84b58859-3a62-4b63-83d6-cc492b2c8e29",
                "positionType": "Cashier",
                "status": 0
              }
            ]
          },
          "dto": {
            "status": 2,
            "position": "Cashier",
            "acls": [
              {
                "microservice": "pos",
                "create": true,
                "read": true,
                "update": true,
                "delete": true
              }
            ]
          },
          "confirmEmployee": false
        }
      }
      """
    And I process messages from RabbitMQ "async_events_auth_micro" channel
    Then print RabbitMQ exchange "async_events" message list
    And the RabbitMQ exchange "async_events" should contain following messages:
    """
    [
      {
        "name": "auth.event.employee.added.synced",
        "payload": {
          "businessId": "74b58859-3a62-4b63-83d6-cc492b2c8e29",
          "employeeId": "ac031fc5-43d8-4e17-a07b-daa1c3b8ea81",
          "userId": "ac031fc5-43d8-4e17-a07b-daa1c3b8ea81"
        }
      }
    ]
    """