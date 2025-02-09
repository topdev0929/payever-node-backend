Feature: Channel set API

  Background:
    Given I remember as "businessId" following value:
      """
      "a803d4c3-c447-4aab-a8c7-c7f184a8e77f"
      """
    Given I remember as "checkoutId" following value:
      """
      "9f12e7bc-ee1a-48de-b3d2-8d49b19f5054"
      """
    Given I remember as "channelSetIdOneShop" following value:
      """
      "69864cec-341b-42a0-8221-37a248c28d38"
      """
    Given I remember as "channelSetIdTwoShop" following value:
      """
      "2a9bc748-ed2a-4065-ae1f-91a398fbd87a"
      """
    Given I remember as "channelSetIdThreeLink" following value:
      """
      "2e04582d-374f-4ea6-ae8d-ce83d9522f9f"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
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

  Scenario: Get all by checkout
    Given I use DB fixture "channel-set/channel-set/by-checkout"
    When I send a GET request to "/api/business/{{businessId}}/channelSet/checkout/{{checkoutId}}"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      [
        {
          "checkout":"{{checkoutId}}",
          "id":"{{channelSetIdOneShop}}",
          "name":"Shop One",
          "type":"shop"
        },
        {
          "checkout":"{{checkoutId}}",
          "id":"{{channelSetIdTwoShop}}",
          "name":"Shop Two",
          "type":"shop"
        },
        {
          "checkout":"{{checkoutId}}",
          "id":"{{channelSetIdThreeLink}}",
          "type":"link"
        }
      ]
      """

  Scenario: Get all by checkout, permission
    Given I am not authenticated
    Given I use DB fixture "channel-set/channel-set/by-channel-and-checkout"
    When I send a GET request to "/api/business/{{businessId}}/channelSet/checkout/{{checkoutId}}"
    Then print last response
    Then the response status code should be 403
