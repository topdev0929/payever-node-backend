@users
Feature: Users
  Background:
    Given I use DB fixture "users"
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


  Scenario: Edit my data
    When I send a PATCH request to "/api/user" with json:
    """
    {
      "secondFactorRequired": true
    }
    """

    Then print last response
    And model "User" with id "b5965f9d-5971-4b02-90eb-537a0a6e07c7" should contain json:
    """
    {
      "secondFactorRequired": true
    }
    """
    And the response status code should be 200
    And the response should contain json:
    """
    {
      "secondFactorRequired": true
    }
    """


  Scenario: Get Users List
    Given I authenticate as a user with the following data:
    """
    {
      "id": "15edf7ca-cc8e-406c-9cd5-964b19eafb11",
      "email": "admin@payever.de",
      "roles": [
      {
        "name": "user",
        "permissions": []
      },
      {
        "name": "admin",
        "permissions": []
      }]
    }
    """

    When I send a GET request to "/api/users?limit=8&filters[email]=admin@payever.de&filters[roles][]=admin&filters[roles][]=merchant"

    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    [{
       "id": "15edf7ca-cc8e-406c-9cd5-964b19eafb11",
       "email": "admin@payever.de",
       "firstName": "Rob",
       "lastName": "Intveld"
    }]
    """


  Scenario: get user data endpoint
    When I send a GET request to "/api/user"

    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
     {
       "_id": "b5965f9d-5971-4b02-90eb-537a0a6e07c7",
       "email": "merchant@example.com",
       "firstName": "Merchant",
       "isActive": true,
       "isVerified": true,
       "lastName": "Merchant",
       "roles": [
         {
           "permissions": [
              "74b58859-3a62-4b63-83d6-cc492b2c8e29",
              "74b58859-3a62-4b63-83d6-cc492b2c8f29"
           ],
           "name": "merchant"
         }
       ],
       "id": "b5965f9d-5971-4b02-90eb-537a0a6e07c7"
     }
    """


  Scenario: update password endpoint
    When I send a POST request to "/api/update" with json:
    """
    {
       "oldPassword": "12345678",
       "newPassword": "Schladdi121@"
    }
    """

    Then print last response
    And the response status code should be 200


  Scenario: update logo endpoint
    When I send a POST request to "/api/update-logo" with json:
    """
    {
       "email": "merchant@example.com",
       "logo_uuid": "2e999013-9598-4ef5-ae76-054a9a7ed265"
    }
    """

    Then print last response
    And the response status code should be 200


  Scenario: reset password endpoint
    Given I use DB fixture "reset-token"

    When I send a POST request to "/api/reset/token" with json:
    """
    {
       "plainPassword": "Schladdi121@"
    }
    """

    Then print last response
    And the response status code should be 200


  Scenario: forgot password endpoint
    When I send a POST request to "/api/forgot" with json:
    """
    {
       "email": "rob@intveld.com"
    }
    """

    Then print last response
    And the response status code should be 204
    And print RabbitMQ exchange "async_events" message list
    And the RabbitMQ exchange "async_events" should contain following messages:
    """
    [
      {
        "createdAt": "*",
        "encryption": "none",
        "metadata": {
          "locale": "en"
        },
        "name": "payever.event.mailer.send",
        "payload": {
          "language": "en",
          "params": {
            "password_reset_url": "https://commerceos.test.devpayever.com/password/reset/*"
          },
          "to": "rob@intveld.com",
          "type": "passwordReset"
        },
        "uuid": "*",
        "version": 0
      }
    ]
    """

  Scenario: forgot password with special charachters in email endpoint
    When I send a POST request to "/api/forgot" with json:
    """
    {
       "email": "rob+1@intveld.com"
    }
    """

    Then print last response
    And the response status code should be 204
    And print RabbitMQ exchange "async_events" message list
    And the RabbitMQ exchange "async_events" should contain following messages:
    """
    [
      {
        "createdAt": "*",
        "encryption": "none",
        "metadata": {
          "locale": "en"
        },
        "name": "payever.event.mailer.send",
        "payload": {
          "language": "en",
          "params": {
            "password_reset_url": "https://commerceos.test.devpayever.com/password/reset/*"
          },
          "to": "rob+1@intveld.com",
          "type": "passwordReset"
        },
        "uuid": "*",
        "version": 0
      }
    ]
    """
  
  Scenario: forgot password with different cases in email endpoint
    When I send a POST request to "/api/forgot" with json:
    """
    {
       "email": "robB5@Intveld.COM"
    }
    """

    Then print last response
    And the response status code should be 204
    And print RabbitMQ exchange "async_events" message list
    And the RabbitMQ exchange "async_events" should contain following messages:
    """
    [
      {
        "createdAt": "*",
        "encryption": "none",
        "metadata": {
          "locale": "en"
        },
        "name": "payever.event.mailer.send",
        "payload": {
          "language": "en",
          "params": {
            "password_reset_url": "https://commerceos.test.devpayever.com/password/reset/*"
          },
          "to": "robb5@Intveld.com",
          "type": "passwordReset"
        },
        "uuid": "*",
        "version": 0
      }
    ]
    """

  Scenario: confirm registration endpoint
    Given I use DB fixture "reset-token"

    When I send a POST request to "/api/confirm/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJpYXQiOjE1NjcwOTc4NjIsImV4cCI6MTAwMTU2NzA5Nzg2Mn0.unPsumTz1vigMbYxGAqJHC0NPzW_-2S7lTMT7VlgbVo"
    Then print last response
    And the response status code should be 204
    And model "User" with id "c82581d9-4c1a-4d18-a209-01ed8e363b62" should contain json:
    """
    {"isVerified": true}
    """

  Scenario: registration endpoint
    Given generating new encrypted string using password "Schladdi121@" and remember as "password"
    And print storage key "password"
    When I send a POST request to "/api/integration/register" with json:
    """
    {
      "data": {
        "email": "test@Test.com",
        "firstName": "Test",
        "lastName": "Test",
        "password": "{{password}}"
      }
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

  Scenario: registration endpoint
    Given generating new encrypted string using password "Schladdi121@" and remember as "password"
    When I send a POST request to "/api/register" with json:
    """
    {
       "email": "Test@Test.com",
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
      "refreshToken": "*"
    }
    """

  Scenario: registration endpoint
    Given generating new encrypted string using password "Schladdi121@" and remember as "password"
    When I send a POST request to "/api/register" with json:
    """
    {
       "email": "newuser.test@test.com",
       "firstName": "Test",
       "lastName": "Test",
       "password": "{{password}}",
       "inviteToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMwM2RiOGZkLWIxNjAtNGNkZC05NDlmLWZhNTY2YzBhOGFlZCIsImJ1c2luZXNzSWQiOiI4MTMzNTk3OS1iZGQwLTRlNjgtYmNjNi0xZGMyZjA0NmU5ZWIiLCJlbWFpbCI6Im5ld3VzZXIudGVzdEB0ZXN0LmNvbSIsImlhdCI6MTYzODU1MDczMywiZXhwIjoxNjM4NjM3MTMzfQ.Az1NrWZWF2KWB5A0odsFdlHX7ZZql6ywcLSqMmdsFeo"
    }
    """

    Then print last response
    And the response status code should be 401

  Scenario: registration endpoint
    Given generating new encrypted string using password "Schladdi121@" and remember as "password" and invalid firstName
    When I send a POST request to "/api/register" with json:
    """
    {
       "email": "newuser.test.name@test.com",
       "firstName": "        ",
       "lastName": "Test",
       "password": "{{password}}",
       "inviteToken": null
    }
    """

    Then print last response
    And the response status code should be 400
    And the response should contain json:
    """
    {
      "errors": [
        {
          "target": {
            "email": "newuser.test.name@test.com",
            "firstName": "",
            "lastName": "Test",
            "password": "*",
            "inviteToken": null
          },
          "value": "",
          "property": "firstName",
          "children": [],
          "constraints": {
            "isNotEmpty": "forms.error.validator.required"
          }
        }
      ],
      "message": "Validation failed",
      "statusCode": 400
    }
    """

  Scenario: registration endpoint - with pwned password
    Given generating new encrypted string using password "Hallo123!" and remember as "password"
    When I send a POST request to "/api/register" with json:
    """
    {
       "email": "pwned.test.password@test.com",
       "firstName": "Test",
       "lastName": "Test",
       "password": "{{password}}",
       "inviteToken": null
    }
    """

    Then print last response
    And the response status code should be 400
    And the response should contain json:
    """
    {
      "errors": [
        {
          "target": {
            "email": "pwned.test.password@test.com",
            "firstName": "Test",
            "lastName": "Test",
            "password": "*",
            "inviteToken": null
          },
          "value": "*",
          "property": "password",
          "children": [],
          "constraints": {
            "PasswordNotPwned": "forms.error.validator.password.pwned"
          }
        }
      ],
      "message": "Validation failed",
      "statusCode": 400
    }
    """

   Scenario: employee registration endpoint
    Given generating new encrypted string using password "Schladdi121@" and remember as "password"
    When I send a POST request to "/api/employee/register" with json:
    """
    {
       "email": "newuser.test@test.com",
       "firstName": "Test",
       "lastName": "Test",
       "password": "{{password}}",
       "inviteToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMwM2RiOGZkLWIxNjAtNGNkZC05NDlmLWZhNTY2YzBhOGFlZCIsImJ1c2luZXNzSWQiOiI4MTMzNTk3OS1iZGQwLTRlNjgtYmNjNi0xZGMyZjA0NmU5ZWIiLCJlbWFpbCI6Im5ld3VzZXIudGVzdEB0ZXN0LmNvbSIsImlhdCI6MTYzODU1MDczMywiZXhwIjoxNjM4NjM3MTMzfQ.Az1NrWZWF2KWB5A0odsFdlHX7ZZql6ywcLSqMmdsFeo"
    }
    """

    Then print last response
    And the response status code should be 401

  Scenario: email validation endpoint
    When I send a GET request to "/api/email/rob@intveld.com/validate" with json:
    """
    {
       "email": "Test@test.com",
       "firstName": "Test",
       "lastName": "Test"
    }
    """

    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    {
      "available": false,
      "valid": true
    }
    """


  Scenario: get logo uuid endpoint
    When I send a GET request to "/api/user-logo/Rob@intveld.com"

    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    {
      "email": "rob@intveld.com",
      "logo_uuid": "78ca2e67-4660-408b-9bf7-0687e9940208"
    }
    """

  Scenario: register new employee - expired token
    Given generating new encrypted string using password "Payever2021!" and remember as "password"
    When I send a POST request to "/api/register" with json:
    """
    {
       "email": "newuser.test@test.com",
       "firstName": "Test",
       "lastName": "Test",
       "password": "{{password}}",
       "inviteToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMwM2RiOGZkLWIxNjAtNGNkZC05NDlmLWZhNTY2YzBhOGFlZCIsImJ1c2luZXNzSWQiOiI4MTMzNTk3OS1iZGQwLTRlNjgtYmNjNi0xZGMyZjA0NmU5ZWIiLCJlbWFpbCI6Im5ld3VzZXIudGVzdEB0ZXN0LmNvbSIsImlhdCI6MTYzODU1MDczMywiZXhwIjoxNjM4NjM3MTMzfQ.Az1NrWZWF2KWB5A0odsFdlHX7ZZql6ywcLSqMmdsFeo"
    }
    """

    Then print last response
    And the response status code should be 401

  Scenario: register new employee with wrong email
    Given generating new encrypted string using password "Payever2021!" and remember as "password"
    When I send a POST request to "/api/register" with json:
    """
    {
       "email": "newuserr.test@test.com",
       "firstName": "Test",
       "lastName": "Test",
       "password": "{{password}}",
       "inviteToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMwM2RiOGZkLWIxNjAtNGNkZC05NDlmLWZhNTY2YzBhOGFlZCIsImJ1c2luZXNzSWQiOiI4MTMzNTk3OS1iZGQwLTRlNjgtYmNjNi0xZGMyZjA0NmU5ZWIiLCJlbWFpbCI6Im5ld3VzZXIudGVzdEB0ZXN0LmNvbSIsImlhdCI6MTYzODU1MDczMywiZXhwIjoxNjM4NjM3MTMzfQ.Az1NrWZWF2KWB5A0odsFdlHX7ZZql6ywcLSqMmdsFeo"
    }
    """
    Then print last response
    And the response status code should be 401

  Scenario: reset password and remove it from blocklist
    Given I use DB fixture "reset-token"
    Given I use DB fixture "brute-force/suspicious-activity"
    When I send a POST request to "/api/reset/token" with json:
    """
    {
       "plainPassword": "Schladdi121@"
    }
    """

    Then print last response
    And the response status code should be 200
    And model "LoginAttempt" found by following JSON should not exist:
    """
    {
      "user": "c82581d9-4c1a-4d18-a209-01ed8e363b62"
    }
    """
    And model "BlockList" found by following JSON should not exist:
    """
    {
      "user": "c82581d9-4c1a-4d18-a209-01ed8e363b62"
    }
    """
  Scenario: register new employee with invalid token
    Given generating new encrypted string using password "Payever2021!" and remember as "password"
    When I send a POST request to "/api/register" with json:
    """
    {
       "email": "newuserr.test@test.com",
       "firstName": "Test",
       "lastName": "Test",
       "password": "{{password}}",
       "inviteToken": "eyJhbGciOiJIUzI1NiIs34InR5cCI6IkpXVCJ9.eyJpZCI6IjMwM2RiOGZkLW5IxNjAtNGNkZC05NDlmLWZhNTY2YzBhOGFlZCIsImJ1c2luZXNzSWQiOiI4MTMzNTk3OS1iZGQwLTRlNjgtYmNjNi0xZGMyZjA0NmU5ZWIiLCJlbWFpbCI6Im5ld3VzZXIudGVzdEB0ZXN0LmNvbSIsImlhdCI6MTYzODU1MDczMywiZXhwIjoxNjM4NjM3MTMzfQ.Az1NrWZWF2KWB5A0odsFdlHX7ZZql6ywcLSqMmdsFeo"
    }
    """
    Then print last response
    And the response status code should be 401
