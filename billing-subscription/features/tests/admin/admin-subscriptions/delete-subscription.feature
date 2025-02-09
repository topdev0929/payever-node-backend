Feature: Delete subscription
  Background:
    Given I remember as "businessId" following value:
      """
        "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "productId" following value:
      """
        "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    Given I remember as "planId" following value:
      """
        "dddddddd-dddd-dddd-dddd-dddddddddddd"
      """
    Given I remember as "subscriptionId" following value:
      """
        "ffffffff-ffff-ffff-ffff-ffffffffffff"
      """
    Given I remember as "connectionId" following value:
      """
        "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee"
      """
    Given I remember as "remoteSubscriptionId" following value:
      """
        "some_identifier"
      """
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

  Scenario: Delete subscription
    Given I use DB fixture "subscriptions/delete-subscription"
    And I mock Elasticsearch method "deleteByQuery" with:
      """
      {
        "arguments": [
          "billing-subscriptions",
          {
            "query": {
              "match_phrase": {
                "mongoId": "{{subscriptionId}}"
              }
            }
          }
         ],
        "result": {}
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
    When I send a DELETE request to "/api/admin/subscriptions/{{subscriptionId}}"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "_id": "*",
        "plan": "{{planId}}",
        "remoteSubscriptionId": "{{remoteSubscriptionId}}"
      }
      """
    And model "Subscription" found by following JSON should not exist:
      """
      {
        "plan": "{{planId}}",
        "remoteSubscriptionId": "{{remoteSubscriptionId}}"
      }
      """

  Scenario: Received confirmed request to disable integration, and integration has subscriptions
    Given I use DB fixture "subscriptions/delete-subscription"
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
          "body": "{\"id\":\"{{planId}}\",\"products\":[{\"id\":\"{{productId}}\"}]}"
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
    When I send a POST request to "/api/settings/{{businessId}}/disable/{{connectionId}}"
    Then print last response
    And the response status code should be 200
    And model "Subscription" found by following JSON should not exist:
      """
      {
        "plan": "{{planId}}",
        "remoteSubscriptionId": "{{remoteSubscriptionId}}"
      }
      """
    And axios mocks should be called
