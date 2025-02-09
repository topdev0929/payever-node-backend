@users
Feature: Users
  Background:
    Given I use DB fixture "users"
    And I remember as "BUSINESS_2_ID" following value:
      """
      "532d6fba-6fb6-447d-b703-bf42e4361c1b"
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

  Scenario: Install apps
    When I publish in RabbitMQ channel "async_events_auth_micro" message with json:
      """
      {
        "name": "apps.rpc.readonly.auth-install-app",
        "payload": {
          "businessId": "{{BUSINESS_2_ID}}",
          "code": "shop",
        "userId": "{{MERCHANT_USER_ID}}"
        }
      }
      """
    And I process messages from RabbitMQ "async_events_auth_micro" channel
    Then look for model "Permission" by following JSON and remember as "permissionData":
      """
      {
        "userId": "{{MERCHANT_USER_ID}}",
        "businessId": "{{BUSINESS_2_ID}}"
      }
      """
    Then stored value "permissionData" should contain json:
      """
      {
        "userId": "{{MERCHANT_USER_ID}}",
        "businessId": "{{BUSINESS_2_ID}}",
        "acls": [
          {
            "create": true,
            "delete": true,
            "microservice": "shop",
            "read": true,
            "update": true
          }
        ]
      }
      """
    Then model "User" with id "{{MERCHANT_USER_ID}}" should contain json:
      """
      {
        "roles": [{
          "name": "merchant",
          "permissions": [
            "*"
          ]
        }]
      }
      """

  Scenario: Uninstall apps
    When I publish in RabbitMQ channel "async_events_auth_micro" message with json:
      """
      {
        "name": "apps.rpc.readonly.auth-uninstall-app",
        "payload": {
          "businessId": "{{BUSINESS_2_ID}}",
          "code": "shop",
        "userId": "{{MERCHANT_USER_ID}}"
        }
      }
      """
    And I process messages from RabbitMQ "async_events_auth_micro" channel
    Then model "User" with id "{{MERCHANT_USER_ID}}" should contain json:
      """
      {
        "roles": [{
          "name": "merchant",
          "permissions": [
            "*"
          ]
        }]
      }
      """

  Scenario: business owner migration apps
    When I publish in RabbitMQ channel "async_events_auth_micro" message with json:
      """
      {
        "name": "users.event.business.owner-migrate",
        "payload": {
          "_id": "{{BUSINESS_2_ID}}",
          "userAccountId": "{{MERCHANT_USER_ID}}"
        }
      }
      """
    And I process messages from RabbitMQ "async_events_auth_micro" channel
    Then look for model "Permission" by following JSON and remember as "permissionData":
      """
      {
        "userId": "{{MERCHANT_USER_ID}}",
        "businessId": "{{BUSINESS_2_ID}}"
      }
      """
    Then stored value "permissionData" should contain json:
      """
      {
        "userId": "{{MERCHANT_USER_ID}}",
        "businessId": "{{BUSINESS_2_ID}}",
        "acls": [
          {
            "create": true,
            "delete": true,
            "microservice": "commerceos",
            "read": true,
            "update": true
          }
        ]
      }
      """
    Then model "User" with id "{{MERCHANT_USER_ID}}" should contain json:
      """
      {
        "roles": [{
          "name": "merchant",
          "permissions": [
            "*"
          ]
        }]
      }
      """

  Scenario: business owner transfer
    When I publish in RabbitMQ channel "async_events_auth_micro" message with json:
      """
      {
        "name": "users.event.business.owner-transfer",
        "payload": {
          "businessId": "{{BUSINESS_2_ID}}",
          "previousOwnerId": "test",
          "newOwnerId": "{{MERCHANT_USER_ID}}"
        }
      }
      """
    And I process messages from RabbitMQ "async_events_auth_micro" channel
    And model "Permission" found by following JSON should not exist:
      """
      {
        "userId": "test",
        "businessId": "{{BUSINESS_2_ID}}"
      }
      """
    Then look for model "Permission" by following JSON and remember as "permissionData":
      """
      {
        "userId": "{{MERCHANT_USER_ID}}",
        "businessId": "{{BUSINESS_2_ID}}"
      }
      """
    Then stored value "permissionData" should contain json:
      """
      {
        "userId": "{{MERCHANT_USER_ID}}",
        "businessId": "{{BUSINESS_2_ID}}",
        "acls": [
          "*"
        ]
      }
      """
    Then model "User" with id "{{MERCHANT_USER_ID}}" should contain json:
      """
      {
        "roles": [{
          "name": "merchant",
          "permissions": [
            "*"
          ]
        }]
      }
      """

  Scenario: install onboarding apps
    When I publish in RabbitMQ channel "async_events_auth_micro" message with json:
      """
      {
        "name": "apps.rpc.readonly.auth-install-onboarding-apps",
        "payload": {
          "businessId": "{{BUSINESS_2_ID}}",
          "apps": ["shop", "transaction", "blog"],
          "userId": "{{MERCHANT_USER_ID}}"
        }
      }
      """
    And I process messages from RabbitMQ "async_events_auth_micro" channel
    Then look for model "Permission" by following JSON and remember as "permissionData":
      """
      {
        "userId": "{{MERCHANT_USER_ID}}",
        "businessId": "{{BUSINESS_2_ID}}"
      }
      """
    Then print storage key "permissionData"
    Then stored value "permissionData" should contain json:
      """
      {
        "userId": "{{MERCHANT_USER_ID}}",
        "businessId": "{{BUSINESS_2_ID}}",
        "acls": [
          {
            "create": true,
            "delete": true,
            "microservice": "shop",
            "read": true,
            "update": true
          },
          {
            "create": true,
            "delete": true,
            "microservice": "transaction",
            "read": true,
            "update": true
          },
          {
            "create": true,
            "delete": true,
            "microservice": "blog",
            "read": true,
            "update": true
          }
        ]
      }
      """
    Then model "User" with id "{{MERCHANT_USER_ID}}" should contain json:
      """
      {
        "roles": [{
          "name": "merchant",
          "permissions": [
            "*"
          ]
        }]
      }
      """

  Scenario: install onboarding apps
    When I publish in RabbitMQ channel "async_events_auth_micro" message with json:
      """
      {
        "name": "apps.readonly.auth-install-onboarding-apps",
        "payload": {
          "businessId": "{{BUSINESS_2_ID}}",
          "apps": ["shop", "transaction", "blog"],
          "userId": "{{MERCHANT_USER_ID}}"
        }
      }
      """
    And I process messages from RabbitMQ "async_events_auth_micro" channel
    Then look for model "Permission" by following JSON and remember as "permissionData":
      """
      {
        "userId": "{{MERCHANT_USER_ID}}",
        "businessId": "{{BUSINESS_2_ID}}"
      }
      """
    Then print storage key "permissionData"
    Then stored value "permissionData" should contain json:
      """
      {
        "userId": "{{MERCHANT_USER_ID}}",
        "businessId": "{{BUSINESS_2_ID}}",
        "acls": [
          {
            "create": true,
            "delete": true,
            "microservice": "shop",
            "read": true,
            "update": true
          },
          {
            "create": true,
            "delete": true,
            "microservice": "transaction",
            "read": true,
            "update": true
          },
          {
            "create": true,
            "delete": true,
            "microservice": "blog",
            "read": true,
            "update": true
          }
        ]
      }
      """
    Then model "User" with id "{{MERCHANT_USER_ID}}" should contain json:
      """
      {
        "roles": [{
          "name": "merchant",
          "permissions": [
            "*"
          ]
        }]
      }
      """

