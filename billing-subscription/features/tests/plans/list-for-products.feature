Feature: Get plans list
  Background:
    Given I remember as "businessId" following value:
      """
        "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "productId1" following value:
      """
        "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    Given I remember as "productId2" following value:
      """
        "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee"
      """
    Given I remember as "planId1" following value:
      """
        "cccccccc-cccc-cccc-cccc-cccccccccccc"
      """
    Given I remember as "planId2" following value:
      """
        "ffffffff-ffff-ffff-ffff-ffffffffffff"
      """
    Given I remember as "subscriptionplanId1" following value:
      """
        "dddddddd-1111-1111-1111-111111111111"
      """
    Given I remember as "subscriptionplanId2" following value:
      """
        "dddddddd-2222-2222-2222-222222222222"
      """
    Given I remember as "integrationName" following value:
      """
        "stripe"
      """
    Given I remember as "connectionId" following value:
      """
        "dddddddd-dddd-dddd-dddd-dddddddddddd"
      """

  Scenario: Received request for getting products plans
    Given I use DB fixture "plans/retrieve-plans-for-products"
    When I send a POST request to "/api/business/{{businessId}}/plan/retrieve-for-products" with json:
      """
      {
        "ids": ["{{productId1}}", "{{productId2}}"]
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
      [
         {
            "_id": "cccccccc-cccc-cccc-cccc-cccccccccccc",
            "business": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
            "connection": {
              "_id": "dddddddd-dddd-dddd-dddd-dddddddddddd",
              "integrationName": "stripe"
            },
            "products": [
              "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
            ],
            "subscriptionPlan": {
              "_id": "dddddddd-1111-1111-1111-111111111111",
              "billingPeriod": 1,
              "interval": "month",
              "planType": "fixed",
              "products": [
                "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
              ]
            }
          },
          {
            "_id": "ffffffff-ffff-ffff-ffff-ffffffffffff",
            "business": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
            "connection": {
              "_id": "dddddddd-dddd-dddd-dddd-dddddddddddd",
              "integrationName": "stripe"
            },
            "products": [
              "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee"
            ],
            "subscriptionPlan": {
              "_id": "dddddddd-2222-2222-2222-222222222222",
              "billingPeriod": 1,
              "interval": "month",
              "planType": "fixed",
              "products": [
                "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee"
              ]
            }
          }
      ]
    """
