Feature: PSP
  Background:
    Given I use DB fixture "organization"
    Given I remember as "businessId" following value:
      """
      "f416393c-ebe0-400d-9d52-d60561298015"
      """
    Given I remember as "organizationId" following value:
      """
      "94f719b7-1ddc-4c35-bd61-637edd939910"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "email": "organization@example.com",
        "id": "{{organizationId}}",
        "roles": [
          {
            "name": "organization",
            "acls": []
          }
        ]
      }
      """

  Scenario: Get businesses
    Given I use DB fixture "organization-businesses"
    When I send a GET request to "/api/psp"
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      [
        {
          "businessId": "f9d1c255-05a5-4ad2-98ac-a904da157d91",
          "organizationId": "{{organizationId}}"
        }
      ]
      """

  Scenario: Get businesses by business Id
    Given I use DB fixture "organization-businesses"
    When I send a GET request to "/api/psp/f9d1c255-05a5-4ad2-98ac-a904da157d91"
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      [
        {
          "businessId": "f9d1c255-05a5-4ad2-98ac-a904da157d91",
          "organizationId": "{{organizationId}}"
        }
      ]
      """


  Scenario: Create business
    Given I mock RPC request "auth.rpc.user.create" to "auth.rpc.user.create" with:
      """
      {
        "requestPayload": {
          "email": "test@onboarding.com",
          "first_name": "Test",
          "last_name": "Testam"
        },
        "responsePayload": [
          {
            "_id": "0083d41b-ed4c-4a8b-befd-9fb5308f87cb",
            "id": "0083d41b-ed4c-4a8b-befd-9fb5308f87cb",
            "email": "test@onboarding.com",
            "first_name": "Test",
            "last_name": "Testam"
          }
        ]
      }
      """
    And I mock RPC request "auth.rpc.user.assign-absolute-permissions" to "auth.rpc.user.assign-absolute-permissions" with:
      """
      {
        "requestPayload": {
          "businessId": "*",
          "userId": "*"
        },
        "responsePayload": true
      }
      """
    And I mock RPC request "users.rpc.business.create" to "users.rpc.business.create" with:
      """
      {
        "requestPayload": {
          "userId": "0083d41b-ed4c-4a8b-befd-9fb5308f87cb"
        },
        "responsePayload": [
          {
            "_id": "f416393c-ebe0-400d-9d52-d60561298015",
            "id": "f416393c-ebe0-400d-9d52-d60561298015",
            "owner": "0083d41b-ed4c-4a8b-befd-9fb5308f87cb",
            "name": "onboarding_test"
          }
        ]
      }
      """
    And I mock RPC request "apps.rpc.apps.install-onboarding-apps" to "apps.rpc.apps.install-onboarding-apps" with:
      """
      {
        "requestPayload": {
          "businessId": "f416393c-ebe0-400d-9d52-d60561298015",
          "userId": "0083d41b-ed4c-4a8b-befd-9fb5308f87cb"
        },
        "responsePayload": true
      }
      """
    And I mock RPC request "connect.rpc.integration-subscriptions.install" to "connect.rpc.integration-subscriptions.install" with:
      """
      {
        "requestPayload": {
          "businessId": "f416393c-ebe0-400d-9d52-d60561298015",
          "integrationName": "qr"
        },
        "responsePayload": [
          {
            "installed": true,
            "name": "qr",
            "scope": []
          }
        ]
      }
      """
    And I mock an axios request with parameters:
      """
      {
        "request": {
          "method": "get",
          "url": "https://qr-backend.test.devpayever.com/api/download/base64*"
        },
        "response": {
          "status": 200,
          "body": "base64 data"
        }
      }
      """
    And I mock an axios request with parameters:
      """
      {
        "request": {
          "method": "post",
          "url": "https://qr-backend.test.devpayever.com/api/form/new-business-id/save"
        },
        "response": {
          "status": 200,
          "body": "{\"accessToken\": \"access-token\"}"
        }
      }
      """
    And I mock RPC request "connect.rpc.integration-subscriptions.install" to "connect.rpc.integration-subscriptions.install" with:
      """
      {
        "requestPayload": {
          "businessId": "f416393c-ebe0-400d-9d52-d60561298015",
          "integrationName": "api"
        },
        "responsePayload": [
          {
            "installed": true,
            "name": "api",
            "scope": []
          }
        ]
      }
      """
    And I mock RPC request "auth.rpc.oauth.clients" to "auth.rpc.oauth.clients" with:
      """
      {
        "requestPayload": {
          "businessId": "f416393c-ebe0-400d-9d52-d60561298015"
        },
        "responsePayload": [
          []
        ]
      }
      """
    And I mock RPC request "auth.rpc.oauth.create-client" to "auth.rpc.oauth.create-client" with:
      """
      {
        "requestPayload": {
          "businessId": "f416393c-ebe0-400d-9d52-d60561298015",
          "userId": "0083d41b-ed4c-4a8b-befd-9fb5308f87cb",
          "name": "PSP",
          "redirectUri": ""
        },
        "responsePayload": [
          {
            "_id": "client-id",
            "id": "client-id",
            "secret": "client-secret"
          }
        ]
      }
      """
    And I mock RPC request "auth.rpc.user.reset-password" to "auth.rpc.user.reset-password" with:
      """
      {
        "requestPayload": {
          "email": "test@onboarding.com"
        },
        "responsePayload":{}
      }
      """
    When I send a POST request to "/api/psp" with json:
      """
      {
        "platformLogin": true,
        "auth": {
          "email": "test@onboarding.com",
          "first_name": "Test",
          "last_name": "Testam"
        },
        "business": {
          "name": "onboarding_test",
          "company_address": {
            "country": "us",
            "city": "Los Angeles",
            "street": "New York Ave.",
            "zip": "90210"
          }
        },
        "payment_methods": [
          {
            "type": "qr",
            "credentials": {
              "type": "png"
            }
          }
        ]
      }
      """
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "business_id": "f416393c-ebe0-400d-9d52-d60561298015",
        "client_id": "client-id",
        "client_secret": "client-secret",
        "integrations": {}
      }
      """

    When I send a POST request to "/api/psp" with json:
      """
      {
        "platformLogin": true,
        "auth": {
          "email": "test@onboarding.com",
          "first_name": "Test",
          "last_name": "Testam"
        },
        "business": {
          "name": "onboarding_test",
          "company_address": {
            "country": "us",
            "city": "Los Angeles",
            "street": "New York Ave.",
            "zip": "90210"
          }
        },
        "payment_methods": [],
        "integrations": ["qr"]
      }
      """
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "business_id": "f416393c-ebe0-400d-9d52-d60561298015",
        "client_id": "client-id",
        "client_secret": "client-secret",
        "integrations": { }
      }
      """

  Scenario: Add payment method
    Given I mock RPC request "connect.rpc.integration-subscriptions.install" to "connect.rpc.integration-subscriptions.install" with:
      """
      {
        "requestPayload": {
          "businessId": "f416393c-ebe0-400d-9d52-d60561298015",
          "integrationName": "qr"
        },
        "responsePayload": [
          {
            "installed": true,
            "name": "qr",
            "scope": []
          }
        ]
      }
      """
    And I mock an axios request with parameters:
      """
      {
        "request": {
          "method": "post",
          "url": "https://qr-backend.test.devpayever.com/api/form/{{businessId}}/save"
        },
        "response": {
          "status": 200,
          "body": "{\"accessToken\": \"access-token\"}"
        }
      }
      """
    And I mock RPC request "auth.rpc.oauth.clients" to "auth.rpc.oauth.clients" with:
      """
      {
        "requestPayload": {
          "businessId": "f416393c-ebe0-400d-9d52-d60561298015"
        },
        "responsePayload": [
          [
            {
              "_id": "client-id",
              "id": "client-id",
              "secret": "client-secret"
            }
          ]
        ]
      }
      """
    And I mock RPC request "connect.rpc.integration-subscriptions.install" to "connect.rpc.integration-subscriptions.install" with:
      """
      {
        "requestPayload": {
          "businessId": "f416393c-ebe0-400d-9d52-d60561298015",
          "integrationName": "wr"
        },
        "responsePayload": [
          [
            {
              "installed": true,
              "name": "wr",
              "scopes": []
            }
          ]
        ]
      }
      """
    When I send a POST request to "/api/psp/{{businessId}}/payment-method" with json:
      """
      {
        "type": "wr",
        "credentials": {
          "type": "png"
        }
      }
      """
    And print last response
    Then the response status code should be 200

  Scenario: Add payment method
    Given I mock RPC request "connect.rpc.integration-subscriptions.uninstall" to "connect.rpc.integration-subscriptions.uninstall" with:
      """
      {
        "requestPayload": {
          "businessId": "f416393c-ebe0-400d-9d52-d60561298015",
          "integrationName": "qr"
        },
        "responsePayload": [
          {
            "installed": false,
            "name": "qr",
            "scope": []
          }
        ]
      }
      """
    And I mock RPC request "auth.rpc.oauth.clients" to "auth.rpc.oauth.clients" with:
      """
      {
        "requestPayload": {
          "businessId": "f416393c-ebe0-400d-9d52-d60561298015"
        },
        "responsePayload": [
          [
            {
              "_id": "client-id",
              "id": "client-id",
              "secret": "client-secret"
            }
          ]
        ]
      }
      """
    When I send a DELETE request to "/api/psp/{{businessId}}/payment-method" with json:
      """
      {
        "type": "qr"
      }
      """
    And print last response
    Then the response status code should be 200

  Scenario: Remove business
    Given I mock RPC request "users.rpc.business.delete" to "users.rpc.business.delete" with:
      """
      {
        "requestPayload": {
          "businessId": "{{businessId}}"
        },
        "responsePayload": true
      }
      """
    When I send a DELETE request to "/api/psp/{{businessId}}"
    And print last response
    Then the response status code should be 200
