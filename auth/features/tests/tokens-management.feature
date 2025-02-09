Feature: Tokens management
  Background:
    Given I use DB fixture "oauth-clients"
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
          "permissions": [{"businessId": "fe593efa-c439-44be-9eaa-52c78962c817", "acls": []}]
        }]
      }
      """

  Scenario: create a token
    Given I use DB fixture "users"
    When I send a POST request to "/oauth/fe593efa-c439-44be-9eaa-52c78962c817/clients" with json:
    """
    {
      "name": "test key",
      "redirectUri": ""
    }
    """

    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    {
      "accessTokenLifetime": 3600,
      "grants": [
        "http://www.payever.de/api/payment"
      ],
      "isActive": true,
      "refreshTokenLifetime": 1209600,
      "scopes": [
        "API_CREATE_PAYMENT"
      ],
      "name": "test key",
      "redirectUri": "",
      "user": "b5965f9d-5971-4b02-90eb-537a0a6e07c7",
      "businessId": "fe593efa-c439-44be-9eaa-52c78962c817"
    }
    """

  Scenario: create a token with organization
    Given I use DB fixture "users"
    Given I use DB fixture "organizations"
    When I send a POST request to "/oauth/fe593efa-c439-44be-9eaa-52c78962c817/clients" with json:
    """
    {
      "organizationId": "6391e66e-2416-4e1f-b09c-88e57bb019c0",
      "name": "test key",
      "redirectUri": ""
    }
    """

    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    {
      "accessTokenLifetime": 3600,
      "grants": [
        "http://www.payever.de/api/payment"
      ],
      "isActive": true,
      "refreshTokenLifetime": 1209600,
      "scopes": [
        "API_CREATE_PAYMENT"
      ],
      "name": "test key",
      "redirectUri": "",
      "user": "b5965f9d-5971-4b02-90eb-537a0a6e07c7",
      "organization": "*"
    }
    """

  Scenario: create a token via RPC
    Given I use DB fixture "users"
    When I publish in RabbitMQ channel "async_events_auth_micro" message with json:
      """
      {
        "name": "auth.rpc.oauth.create-client",
        "payload": {
          "businessId": "fe593efa-c439-44be-9eaa-52c78962c817",
          "userId": "09d1fdca-f692-4609-bc2d-b3003a24c30a",
          "name": "test key",
          "redirectUri": ""
        }
      }
      """
    And I process messages from RabbitMQ "async_events_auth_micro" channel
    Then look for model "OAuthClient" by following JSON and remember as "client":
      """
      {
        "user": "09d1fdca-f692-4609-bc2d-b3003a24c30a",
        "businesses": "fe593efa-c439-44be-9eaa-52c78962c817"
      }
      """
    And print storage key "client"
    Then stored value "client" should contain json:
      """
      {
        "accessTokenLifetime": 3600,
        "grants": [
          "http://www.payever.de/api/payment"
        ],
        "isActive": true,
        "refreshTokenLifetime": 1209600,
        "scopes": [
          "API_CREATE_PAYMENT"
        ],
        "name": "test key",
        "redirectUri": "",
        "user": "09d1fdca-f692-4609-bc2d-b3003a24c30a",
        "businesses": ["fe593efa-c439-44be-9eaa-52c78962c817"]
      }
      """

  Scenario: Delete a token
    When I send a DELETE request to "/oauth/fe593efa-c439-44be-9eaa-52c78962c817/clients/10276_4r9ki908848w844scwcwooo0swwcggg8csows8cwsso8swgsk4"

    Then print last response
    Then the response status code should be 204


  Scenario: Get a token
    When I send a GET request to "/oauth/fe593efa-c439-44be-9eaa-52c78962c817/clients/10276_4r9ki908848w844scwcwooo0swwcggg8csows8cwsso8swgsk4"

    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    {
      "accessTokenLifetime": 3600,
      "grants": [
        "token",
        "authorization_code",
        "refresh_token",
        "client_credentials",
        "http://www.payever.de/api/payment",
        "http://www.payever.de/api/merchant",
        "http://www.payever.de/rest"
      ],
      "isActive": true,
      "refreshTokenLifetime": 1209600,
      "scopes": [
        "API_CREATE_PAYMENT"
      ],
      "name": "BB",
      "redirectUri": "",
      "user": "b5965f9d-5971-4b02-90eb-537a0a6e07c7",
      "id": "10276_4r9ki908848w844scwcwooo0swwcggg8csows8cwsso8swgsk4",
      "businessId": "fe593efa-c439-44be-9eaa-52c78962c817"
    }
    """


  Scenario: Get a token list
    When I send a GET request to "/oauth/fe593efa-c439-44be-9eaa-52c78962c817/clients"

    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    [
      {
        "accessTokenLifetime": 3600,
        "grants": [
          "token",
          "authorization_code",
          "refresh_token",
          "client_credentials",
          "http://www.payever.de/api/payment",
          "http://www.payever.de/api/merchant",
          "http://www.payever.de/rest"
        ],
        "isActive": true,
        "refreshTokenLifetime": 1209600,
        "scopes": [
          "API_CREATE_PAYMENT"
        ],
        "name": "BB",
        "redirectUri": "",
        "user": "b5965f9d-5971-4b02-90eb-537a0a6e07c7",
        "id": "10276_4r9ki908848w844scwcwooo0swwcggg8csows8cwsso8swgsk4",
        "businessId": "fe593efa-c439-44be-9eaa-52c78962c817"
      }
    ]
    """

  Scenario: Get a token list via RPC
    When I publish in RabbitMQ channel "async_events_auth_micro" message with json:
      """
      {
        "name": "auth.rpc.oauth.clients",
        "payload": {
          "businessId": "fe593efa-c439-44be-9eaa-52c78962c817"
        }
      }
      """
    And I process messages from RabbitMQ "async_events_auth_micro" channel
