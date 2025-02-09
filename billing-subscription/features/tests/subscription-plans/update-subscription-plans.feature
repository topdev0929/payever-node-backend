Feature: Update subscription plans
  Background:
    Given I remember as "businessId" following value:
      """
        "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "productId" following value:
      """
        "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    Given I remember as "subscriptionPlanId" following value:
      """
        "dddddddd-1111-1111-1111-111111111111"
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
    And I mock Elasticsearch method "search" with:
      """
      {
        "arguments": [
          "subscription-folder",
          {}
         ],
        "result": {}
      }
      """

  Scenario: Received request for update subscription plans
    Given I use DB fixture "subscription-plans/delete-subscription-plan"
    When I send a PUT request to "/api/business/{{businessId}}/subscription-plans/{{subscriptionPlanId}}" with json:
      """
      {
        "billingPeriod": 1,
        "interval": "week",
        "name": "Some subscription plan 2",
        "products": [
          {
            "_id": "{{productId}}",
            "image": "someImageUrl",
            "price": 123,
            "title": "some title"
          }
        ]
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
      {
        "_id": "{{subscriptionPlanId}}",
        "billingPeriod": 1,
        "interval": "week",
        "name": "Some subscription plan 2"
      }
    """
    And model "SubscriptionPlan" found by following JSON should not exist:
      """
      {
        "_id": "{{subscriptionPlanId}}",
        "interval": "month",
        "name": "Some subscription plan"
      }
      """
    And model "SubscriptionPlan" with id "{{subscriptionPlanId}}" should contain json:
      """
      {
        "businessId": "{{businessId}}",
        "interval": "week",
        "name": "Some subscription plan 2"
      }
      """

  Scenario: Set subscription plans as default
    Given I use DB fixture "subscription-plans/delete-subscription-plan"
    When I send a PATCH request to "/api/business/{{businessId}}/subscription-plans/{{subscriptionPlanId}}/set-default"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
      {
        "_id": "{{subscriptionPlanId}}",
        "isDefault": true
      }
    """
