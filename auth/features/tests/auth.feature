Feature: Authentication
  Background:
    Given I authenticate as a user with the following data:
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
                "businessId": "74b58859-3a62-4b63-83d6-cc492b2c8e29",
                "acls": []
              }
            ]
          }
        ]
      }
      """

  Scenario: Login as admin
    Given I use DB fixture "users"
    And I am not authenticated
    And I set header "User-Agent" with value "node-superagent/3.8.3"

    When I send a POST request to "/api/login" with json:
      """
      {
        "email": "admin@payever.de",
        "plainPassword": "12345678"
      }
      """
    And look for model "RefreshToken" by following JSON and remember as "refresh_token":
      """
      {
        "userId": "15edf7ca-cc8e-406c-9cd5-964b19eafb11"
      }
      """

    And the response status code should be 200
    And the response should contain json:
      """
      {
        "refreshToken": "*"
      }
      """

  Scenario: Login as admin using integration api
    Given I use DB fixture "users"
    And I am not authenticated
    And I set header "User-Agent" with value "node-superagent/3.8.3"

    When I send a POST request to "/api/integration/login" with json:
      """
      {
        "data": {
          "email": "admin@payever.de",
          "plainPassword": "12345678"
        }
      }
      """
    And look for model "RefreshToken" by following JSON and remember as "refresh_token":
      """
      {
        "userId": "15edf7ca-cc8e-406c-9cd5-964b19eafb11"
      }
      """

    And the response status code should be 200
    And the response should contain json:
      """
      {
        "refreshToken": "*"
      }
      """

  Scenario: Login as a merchant
    Given I use DB fixture "users"
    And I am not authenticated

    Given I set header "User-Agent" with value "Cucumber"
    When I send a POST request to "/api/login" with json:
      """
      {
        "email": "merchant@example.com",
        "plainPassword": "12345678"
      }
      """
    Then print last response
    And look for model "Location" by following JSON and remember as "location":
      """
      {"userId": "b5965f9d-5971-4b02-90eb-537a0a6e07c7"}
      """
    And stored value "location" should contain json:
      """
      { "userAgent": "*" }
      """
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "accessToken": "*",
        "refreshToken": "*"
      }
      """

  Scenario: get Token with businesses
    Given I use DB fixture "users"
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
                "businessId": "74b58859-3a62-4b63-83d6-cc492b2c8e29",
                "acls": []
              }
            ]
          }
        ]
      }
      """

    When I send a PATCH request to "/api/business/74b58859-3a62-4b63-83d6-cc492b2c8e29/enable" with json:
      """
      {
        "email": "merchant@example.com",
        "plainPassword": "12345678"
      }
      """
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "accessToken": "*",
        "refreshToken": "*"
      }
      """

  Scenario: get app code permission status
    Given I use DB fixture "users"
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
                "businessId": "74b58859-3a62-4b63-83d6-cc492b2c8e29",
                "acls": [
                  {
                    "microservice": "pos",
                    "read": true
                  }
                ]
              }
            ]
          }
        ]
      }
      """

    When I send a GET request to "/api/business/74b58859-3a62-4b63-83d6-cc492b2c8e29/pos/has-permissions"
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "hasPermissions": true
      }
      """

    Scenario: Check access
      Given I use DB fixture "users"
      Given I use DB fixture "business"
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
                  "businessId": "74b58859-3a62-4b63-83d6-cc492b2c8e29",
                  "acls": [
                    {
                      "microservice": "pos",
                      "read": true
                    }
                  ]
                }
              ]
            }
          ]
        }
        """
      When I send a GET request to "/api/business/74b58859-3a62-4b63-83d6-cc492b2c8e29/enable/access"
      And the response status code should be 200
      And the response should contain json:
        """
        {
          "hasAccess": true,
          "userTypeBusiness": "Owner"
        }
        """

    Scenario: Check access
      Given I use DB fixture "users"
      Given I use DB fixture "business"

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
                  "businessId": "74b58859-3a62-4b63-83d6-cc492b2c8e29",
                  "acls": [
                    {
                      "microservice": "pos",
                      "read": true
                    }
                  ]
                }
              ]
            }
          ]
        }
        """
      When I send a GET request to "/api/business/74b58859-3a62-4b63-83d6-cc492b2c8e32/enable/access"
      And the response status code should be 200
      And the response should contain json:
        """
        {
          "hasAccess": false
        }
        """

  Scenario: get app code permission status with wrong app
    Given I use DB fixture "users"
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
                "businessId": "74b58859-3a62-4b63-83d6-cc492b2c8e29",
                "acls": [
                  {
                    "microservice": "pos",
                    "read": true
                  }
                ]
              }
            ]
          }
        ]
      }
      """

    When I send a GET request to "/api/business/74b58859-3a62-4b63-83d6-cc492b2c8e29/checkout/has-permissions"
    And the response status code should be 200
    Then print last response
    And the response should contain json:
      """
      {
        "hasPermissions": false
      }
      """

  Scenario: get app code permission status with wrong business
    Given I use DB fixture "users"
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
                "businessId": "74b58859-3a62-4b63-83d6-cc492b2c8e29",
                "acls": [
                  {
                    "microservice": "pos",
                    "read": true
                  }
                ]
              }
            ]
          }
        ]
      }
      """

    When I send a GET request to "/api/business/74b58859-3b62-4b63-83d6-cc492b2c8e29/pos/has-permissions"
    And the response status code should be 200
    Then print last response
    And the response should contain json:
      """
      {
        "hasPermissions": false
      }
      """

  Scenario: Login as a merchant using integration api
    Given I use DB fixture "users"
    And I am not authenticated
    Given I set header "User-Agent" with value "Cucumber"
    When I send a POST request to "/api/integration/login" with json:
      """
      {
        "data": {
          "email": "merchant@example.com",
          "plainPassword": "12345678"
        }
      }
      """
    Then print last response
    And look for model "Location" by following JSON and remember as "location":
      """
      { "userId": "b5965f9d-5971-4b02-90eb-537a0a6e07c7"}
      """
    And stored value "location" should contain json:
      """
      { "userAgent": "*"}
      """
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "accessToken": "*",
        "refreshToken": "*"
      }
      """

  Scenario: Invalid password
    Given I use DB fixture "users"
    And I am not authenticated

    When I send a POST request to "/api/login" with json:
      """
      {
        "email": "Merchant@example.com",
        "plainPassword": "123456789"
      }
      """

    Then print last response
    And the response status code should be 401
    And the response should contain json:
      """
      {
        "statusCode": 401,
        "message": "Wrong Email or Password",
        "reason": "REASON_WRONG_PASSWORD"
      }
      """

  Scenario: Refresh token endpoint
    # a refresh token expiring in 2029
    Given I remember as "refresh_token" following value:
      """
      {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7InRva2VuSWQiOiI1ZDAyNmM0NzkwZDY1NDc2Nzk1ZjRmYzEiLCJ1c2VySWQiOiJiNTk2NWY5ZC01OTcxLTRiMDItOTBlYi01MzdhMGE2ZTA3YzciLCJlbWFpbCI6Im1lcmNoYW50QGV4YW1wbGUuY29tIiwiZmlyc3ROYW1lIjoiTWVyY2hhbnQiLCJsYXN0TmFtZSI6Ik1lcmNoYW50In0sImlhdCI6MTU2MDQzOTg3OSwiZXhwIjoxODc2MDA5Mzk5fQ.2PTiQyVtB89ctEBflP_r0ibDR_nPtuvBZ4PS5X38eCw"
      }
      """
    And I use DB fixture "users"
    And I use DB fixture "refresh-tokens"
    And I set header "Authorization" with value "Bearer {{refresh_token.token}}"
    And I set header "User-Agent" with value "node-superagent/3.8.3"

    When I send a GET request to "/api/refresh"

    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "accessToken": "*"
      }
      """

  Scenario: Invalid device fingerprint - invalidate all tokens
    Given I remember as "refresh_token" following value:
      """
      {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7InRva2VuSWQiOiI1ZDAyNmM0NzkwZDY1NDc2Nzk1ZjRmYzEiLCJ1c2VySWQiOiJiNTk2NWY5ZC01OTcxLTRiMDItOTBlYi01MzdhMGE2ZTA3YzciLCJlbWFpbCI6Im1lcmNoYW50QGV4YW1wbGUuY29tIiwiZmlyc3ROYW1lIjoiTWVyY2hhbnQiLCJsYXN0TmFtZSI6Ik1lcmNoYW50In0sImlhdCI6MTU2MDQzOTg3OSwiZXhwIjoxODc2MDA5Mzk5fQ.2PTiQyVtB89ctEBflP_r0ibDR_nPtuvBZ4PS5X38eCw"
      }
      """
    And I use DB fixture "users"
    And I use DB fixture "refresh-tokens"
    And I set header "Authorization" with value "Bearer {{refresh_token.token}}"
    And I set header "User-Agent" with value "Mozilla"

    When I send a GET request to "/api/refresh"
    And look for model "RefreshToken" by following JSON and remember as "revoked_token":
      """
      { "_id": "5d026c4790d65476795f4fc1" }
      """
    And look for model "RefreshToken" by following JSON and remember as "admin_token":
      """
      { "_id": "5cf01a4350e9bd3678f0325d" }
      """

    Then stored value "revoked_token" should contain json:
      """
      { "revoked": true}
      """
    And model "RefreshToken" found by following JSON should not exist:
      """
      {
        "user_id": "'b5965f9d-5971-4b02-90eb-537a0a6e07c7'",
        "revoked": false
      }
      """
    And stored value "admin_token" should contain json:
      """
      {"revoked": false}
      """
    And the response status code should be 403
    And the response should contain json:
      """
      {
        "statusCode": 403,
        "message": "Caution! Invalid refresh token received! Will invalidate all other refresh tokens."
      }
      """


  Scenario: List current sessions
    Given I use DB fixture "users"
    And I use DB fixture "refresh-tokens"
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
                "businessId": "74b58859-3a62-4b63-83d6-cc492b2c8e29",
                "acls": []
              }
            ]
          }
        ]
      }
      """

    When I send a GET request to "/api/sessions"

    Then the response status code should be 200
    And the response should contain json:
      """
      [{
        "_id": "5d026c4790d65476795f4fc1",
        "revoked": false,
        "user": "b5965f9d-5971-4b02-90eb-537a0a6e07c7",
        "userAgent": "node-superagent/3.8.3"
      }]
      """


  Scenario: Revoke token(s)
    Given I use DB fixture "users"
    And I use DB fixture "refresh-tokens"

    When I send a DELETE request to "/api/sessions" with json:
      """
      {"tokens": ["5d026c4790d65476795f4fc1"]}
      """

    Then the response status code should be 200
    And look for model "RefreshToken" by following JSON and remember as "refresh_token":
      """
      {"_id": "5d026c4790d65476795f4fc1"}
      """

    And print storage key "refresh_token"

    And stored value "refresh_token" should contain json:
      """
      {"revoked": true}
      """

  Scenario: invalid User-Agent header in access token
    Given I use DB fixture "users"
    Given I generate an access token using the following data and remember it as "access_token":
      """
      {
        "email": "merchant@example.com",
        "roles": [
          {
            "name": "admin",
            "permissions": []
          }
        ],
        "hash": "let's assume that this is a valid User-Agent sha256 hash"
      }
      """
    When I set header "Authorization" with value "Bearer {{access_token}}"
    And I set header "User-Agent" with value "Mozilla"
    And I send a PATCH request to "/api/user" with json:
      """
      {
        "secondFactor": true
      }
      """
    Then the response status code should be 403

   Scenario: Logout
    Given I use DB fixture "users"
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
    When I send a POST request to "/api/logout"
    And the response status code should be 200

  Scenario: Login as a non existed user, already baned
    Given I use DB fixture "brute-force/non-existed-users"
    And I am not authenticated

    When I send a POST request to "/api/login" with json:
      """
      {
        "email": "merchant_not_existed@example.com",
        "plainPassword": "12345678"
      }
      """
    Then print last response
    And the response status code should be 401
    And the response should contain json:
      """
      {
        "statusCode": 401,
        "reason": "REASON_WRONG_PASSWORD"
      }
      """


  Scenario: Employee login with -- verified domain
    Given I use DB fixture "users"
    Given I use DB fixture "trusted-domain"
    Given I use DB fixture "business"
    And I am not authenticated

    Given I set header "User-Agent" with value "Cucumber"
    When I send a POST request to "/api/login/employee/74b58859-3a62-4b63-83d6-cc492b2c8e29" with json:
      """
      {
        "email": "merchant@example.com",
        "plainPassword": "12345678"
      }
      """
    Then print last response
    And look for model "Location" by following JSON and remember as "location":
      """
      {"userId": "b5965f9d-5971-4b02-90eb-537a0a6e07c7"}
      """
    And stored value "location" should contain json:
      """
      { "userAgent": "*" }
      """
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
          "businessId": "74b58859-3a62-4b63-83d6-cc492b2c8e29",
          "employee": {
            "email": "merchant@example.com"
          }
        }
      }
    ]
    """

    Scenario: Employee login with -- not verified domain
    Given I use DB fixture "users"
    Given I use DB fixture "trusted-domain"
    Given I use DB fixture "business"
    And I am not authenticated

    Given I set header "User-Agent" with value "Cucumber"
    When I send a POST request to "/api/login/employee/74b58859-3a62-4b63-83d6-cc492b2c8e28" with json:
      """
      {
        "email": "merchant@example.com",
        "plainPassword": "12345678"
      }
      """
    Then print last response
    And look for model "Location" by following JSON and remember as "location":
      """
      {"userId": "b5965f9d-5971-4b02-90eb-537a0a6e07c7"}
      """
    And stored value "location" should contain json:
      """
      { "userAgent": "*" }
      """
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
          "businessId": "74b58859-3a62-4b63-83d6-cc492b2c8e28",
          "employee": {
            "email": "merchant@example.com"
          }
        }
      }
    ]
    """

