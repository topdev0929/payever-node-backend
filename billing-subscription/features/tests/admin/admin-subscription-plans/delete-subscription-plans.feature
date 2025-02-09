Feature: Admin delete subscription plan for product
  Background:
    Given I remember as "businessId" following value:
      """
        "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "businessId2" following value:
      """
        "cccccccc-cccc-cccc-cccc-cccccccccccc"
      """
    Given I remember as "productId" following value:
      """
        "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    Given I remember as "planId" following value:
      """
        "dddddddd-dddd-dddd-dddd-dddddddddddd"
      """
    Given I remember as "subscriptionPlanId" following value:
      """
        "dddddddd-1111-1111-1111-111111111111"
      """
    Given I remember as "connectionId" following value:
      """
        "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee"
      """
    Given I remember as "remoteSubscriptionId" following value:
      """
        "some_identifier"
      """
    

  Scenario: Received request for delete subscription plans, without authentication
    Given I am not authenticated
    Given I use DB fixture "subscription-plans/delete-subscription-plan"
    When I send a DELETE request to "/api/admin/subscription-plans/{{subscriptionPlanId}}"
    Then print last response
    And the response status code should be 403

  Scenario: Received request for delete subscription plans
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@email.com",
        "roles": [
          {"name":"admin","permissions":[]},
          {"name": "merchant","permissions": []}
        ]
      }
      """
    Given I use DB fixture "subscription-plans/delete-subscription-plan"
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
          "body": "{\"id\":\"dddddddd-dddd-dddd-dddd-dddddddddddd\",\"products\":[]}"
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
          "url": "http://third-party.service/api/business/{{businessId}}/connection/{{connectionId}}/action/unsubscribe",
          "headers": {
            "Authorization": "*",
            "User-Agent": "Billing Subscriptions"
          },
          "body": "{\"ids\":[\"{{remoteSubscriptionId}}\"]}"
        },
        "response": {
          "status": 200
        }
      }
      """
    And I mock Elasticsearch method "deleteByQuery" with:
      """
      {
        "arguments": [
          "subscription-folder",
          {}
         ],
        "result": {}
      }
      """
    When I send a DELETE request to "/api/admin/subscription-plans/{{subscriptionPlanId}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
      {
        "_id": "{{subscriptionPlanId}}",
        "billingPeriod": 1,
        "interval": "month",
        "name": "Some subscription plan"
      }
    """
    And model "SubscriptionPlan" found by following JSON should not exist:
      """
      {
        "plan": "{{subscriptionPlanId}}"
      }
      """
    And model "ConnectionPlan" found by following JSON should not exist:
      """
      {
        "subscriptionPlan": "{{subscriptionPlanId}}"
      }
      """
    And model "Subscription" found by following JSON should not exist:
      """
      {
        "plan": "{{planId}}"
      }
      """
