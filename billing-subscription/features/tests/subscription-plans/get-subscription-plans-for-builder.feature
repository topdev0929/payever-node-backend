Feature: Get subscription plan for product
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

  Scenario: Received request for get subscription plans
    Given I use DB fixture "subscription-plans/get-subscription-plan"
    When I send a POST request to "/api/builder/subscription-plans" with json:
    """
    {
      "business": "{{businessId}}"
    }
    """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
      [
        {
          "id": "{{subscriptionPlanId}}",
          "billingPeriod": 1,
          "interval": "month",
          "name": "Some subscription plan",
          "products": [
            {
              "_id": "{{productId}}"
            }
          ]
        }
      ]
    """
