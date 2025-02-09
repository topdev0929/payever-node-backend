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
          {"name":"admin","permissions":[]},
          {"name": "merchant","permissions": []}
        ]
      }
      """
    
  Scenario: get subscription plans
    Given I use DB fixture "subscriptions/get-subscription"
    When I send a GET request to "/api/admin/subscriptions"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "documents": [
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
      }
      """



  Scenario: get subscription plan by id
    Given I use DB fixture "subscriptions/get-subscription"
    When I send a GET request to "/api/admin/subscriptions/ffffffff-ffff-ffff-ffff-ffffffffffff"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "_id":"ffffffff-ffff-ffff-ffff-ffffffffffff",
        "customerEmail": "customer@email",
        "customerName": "Customer name 1",
        "plan": "dddddddd-dddd-dddd-dddd-dddddddddddd",
        "reference": "a71746b8-1456-44d0-8715-ade591a434b6",
        "remoteSubscriptionId": "some_identifier",
        "transactionUuid": "11111111-1111-1111-1111-111111111111",
        "userId": "cccccccc-cccc-cccc-cccc-cccccccccccc"
      }
      """
