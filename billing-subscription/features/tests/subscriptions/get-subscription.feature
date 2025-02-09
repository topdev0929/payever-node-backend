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
    Given I remember as "transactionId1" following value:
      """
        "11111111-1111-1111-1111-111111111111"
      """
    Given I remember as "transactionId2" following value:
      """
        "22222222-2222-2222-2222-222222222222"
      """
    Given I remember as "transactionId3" following value:
      """
        "33333333-3333-3333-3333-333333333333"
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
    
  Scenario: Received request for create subscription plans
    Given I use DB fixture "subscriptions/get-subscription"
    When I send a GET request to "/api/subscriptions/{{businessId}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
      [
        {
          "transactionUuid": "{{transactionId1}}",
          "customerEmail": "customer@email",
          "customerName": "Customer name 1"
        },
        {
          "transactionUuid": "{{transactionId2}}",
          "customerEmail": "customer@email",
          "customerName": "Customer name 2"
        },
        {
          "transactionUuid": "{{transactionId3}}",
          "customerEmail": "customer@email",
          "customerName": "Customer name 3"
        }
      ]
    """
