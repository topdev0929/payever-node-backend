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
    
  Scenario: Received request for get subscription plans
    Given I use DB fixture "subscription-plans/get-subscription-plan"
    When I send a GET request to "/api/business/{{businessId}}/subscription-plans"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
      [
        {
          "billingPeriod": 1,
          "interval": "month",
          "name": "Some subscription plan"
        }
      ]
    """
    
  Scenario: Received request for get subscription plan by id
    Given I use DB fixture "subscription-plans/get-subscription-plan"
    When I send a GET request to "/api/business/{{businessId}}/subscription-plans/dddddddd-1111-1111-1111-111111111111"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
      {
        "billingPeriod": 1,
        "interval": "month",
        "name": "Some subscription plan"
      }
    """
