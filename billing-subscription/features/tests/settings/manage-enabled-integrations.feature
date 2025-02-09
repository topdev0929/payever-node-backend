Feature: Create subscriptions plans when integration being enabled and remove plans when integration disabled
  Background:
    Given I remember as "businessId" following value:
      """
        "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "productId1" following value:
      """
        "aaaaaaaa-1111-1111-1111-111111111111"
      """
    Given I remember as "productId2" following value:
      """
        "aaaaaaaa-2222-2222-2222-222222222222"
      """
    Given I remember as "connectionId" following value:
      """
        "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee"
      """
    Given I remember as "subscriptionPlanId1" following value:
      """
        "dddddddd-1111-1111-1111-111111111111"
      """
    Given I remember as "subscriptionPlanId2" following value:
      """
        "dddddddd-2222-2222-2222-222222222222"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@email.com",
        "roles": [
          {
            "name": "merchant",
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
    Given I remember as "integrationName" following value:
      """
        "stripe"
      """

  Scenario: Not authenticated attempts to update settings
    Given I am not authenticated
    When I send a POST request to "/api/settings/{{businessId}}/enable/cccccccc-cccc-cccc-cccc-cccccccccccc"
    Then print last response
    Then the response status code should be 403

  Scenario: Enable integration
    Given I use DB fixture "settings/save-new-integration"
    And I mock an axios request with parameters:
      """
      {
        "request": {
           "method": "post",
           "url": "http://third-party.service/api/business/bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb/connection/eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee/action/plan-create",
           "body": "{\"billingPeriod\":1,\"business\":{\"id\":\"bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb\"},\"currency\":\"EUR\",\"id\":\"*\",\"interval\":\"month\",\"products\":[{\"id\":\"aaaaaaaa-1111-1111-1111-111111111111\",\"title\":\"product 1\"}]}",
           "headers": {
             "Accept": "application/json",
             "Content-Type": "application/json;charset=utf-8",
             "Authorization": "*",
             "User-Agent": "Billing Subscriptions"
           }
        },
        "response": {
          "status": 200,
          "body": ""
        }
      }
      """
    And I mock an axios request with parameters:
      """
      {
        "request": {
          "method": "post",
          "url": "http://third-party.service/api/business/{{businessId}}/connection/{{connectionId}}/action/plan-create",
          "headers": {
             "Authorization": "*",
             "User-Agent": "Billing Subscriptions"
           },
          "body": "{\"billingPeriod\":2,\"business\":{\"id\":\"bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb\"},\"currency\":\"EUR\",\"id\":\"*\",\"interval\":\"month\",\"products\":[{\"id\":\"aaaaaaaa-2222-2222-2222-222222222222\",\"title\":\"product 2\"}]}"
        },
        "response": {
          "status": 200,
          "body": ""
        }
      }
      """
    When I send a POST request to "/api/settings/{{businessId}}/enable/{{connectionId}}"
    Then print last response
    And the response status code should be 200
    And I look for model "ConnectionPlan" by following JSON and remember as "product1Plan":
      """
      {
        "subscriptionPlan": "{{subscriptionPlanId1}}",
        "connection": "{{connectionId}}"
      }
      """
    And I look for model "ConnectionPlan" by following JSON and remember as "product2Plan":
      """
      {
        "subscriptionPlan": "{{subscriptionPlanId2}}",
        "connection": "{{connectionId}}"
      }
      """
    And model "ConnectionPlan" with id "{{product1Plan._id}}" should contain json:
      """
      {
        "businessId": "{{businessId}}"
      }
      """
    And model "ConnectionPlan" with id "{{product2Plan._id}}" should contain json:
      """
      {
        "businessId": "{{businessId}}"
      }
      """
    And axios mocks should be called

  Scenario: Disable integration
    Given I use DB fixture "settings/disable-integration"
    And I mock an axios request with parameters:
      """
      {
        "request": {
          "method": "post",
          "url": "http://third-party.service/api/business/{{businessId}}/connection/{{connectionId}}/action/plan-delete",
          "headers": {
            "Authorization": "*",
            "User-Agent": "Billing Subscriptions"
          },
          "body": "{\"id\":\"cccccccc-1111-1111-1111-111111111111\",\"products\":[{\"id\":\"aaaaaaaa-1111-1111-1111-111111111111\"}]}"
        },
        "response": {
          "status": 200,
          "body": ""
        }
      }
      """
    And I mock an axios request with parameters:
      """
      {
        "request": {
          "method": "post",
          "url": "http://third-party.service/api/business/{{businessId}}/connection/{{connectionId}}/action/plan-delete",
          "headers": {
            "Authorization": "*",
            "User-Agent": "Billing Subscriptions"
          },
          "body": "{\"id\":\"cccccccc-2222-2222-2222-222222222222\",\"products\":[{\"id\":\"aaaaaaaa-2222-2222-2222-222222222222\"}]}"
        },
        "response": {
          "status": 200,
          "body": ""
        }
      }
      """
    When I send a POST request to "/api/settings/{{businessId}}/disable/{{connectionId}}"
    Then print last response
    And the response status code should be 200
    And model "ConnectionPlan" found by following JSON should not exist:
      """
      {
        "subscriptionPlan": "{{subscriptionPlanId1}}",
        "connection": "{{connectionId}}"
      }
      """
    And model "ConnectionPlan" found by following JSON should not exist:
      """
      {
        "subscriptionPlan": "{{subscriptionPlanId2}}",
        "paymentMethod": "{{integrationName}}"
      }
      """
    And axios mocks should be called
