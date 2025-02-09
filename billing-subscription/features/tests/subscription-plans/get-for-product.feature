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
    Given I remember as "planId1" following value:
      """
        "cccccccc-cccc-cccc-cccc-cccccccccccc"
      """
    Given I remember as "planId2" following value:
      """
        "ffffffff-ffff-ffff-ffff-ffffffffffff"
      """
    Given I remember as "integrationName" following value:
      """
        "stripe"
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

  Scenario: Received request for getting product subscription plans
    Given I use DB fixture "plans/retrieve-plans-for-products"
    When I send a GET request to "/api/business/{{businessId}}/subscription-plans/product/{{productId}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
      {
         "billingPeriod": 1,
         "interval": "month",
         "name": "Some Subscription Plan Name"
      }
    """
