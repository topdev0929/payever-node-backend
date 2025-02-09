Feature: Channel set API

  Background:
    Given I remember as "businessId" following value:
      """
      "a803d4c3-c447-4aab-a8c7-c7f184a8e77f"
      """
    Given I remember as "checkoutIdOne" following value:
      """
      "9f12e7bc-ee1a-48de-b3d2-8d49b19f5054"
      """
    Given I remember as "checkoutIdTwo" following value:
      """
      "184a8e77-ee1a-48de-b3d2-8d49b19f5054"
      """
    Given I remember as "channelSetIdOneLink" following value:
      """
      "a888336c-fe1f-439c-b13c-f351db6bbc2e"
      """
    Given I remember as "channelSetIdTwoLink" following value:
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

  Scenario: Change checkout for ChannelSet
    Given I use DB fixture "channel-set/channel-set-checkout/change-checkout"
    When I send a PATCH request to "/api/business/{{businessId}}/channelSet/{{channelSetIdOneLink}}/checkout" with json:
      """
      {
        "checkoutId": "{{checkoutIdTwo}}"
      }
      """
    Then print last response
    Then the response status code should be 200
    Then model "ChannelSet" with id "{{channelSetIdOneLink}}" should contain json:
      """
      {
        "checkout": "{{checkoutIdTwo}}"
      }
      """

  Scenario: Change checkout for ChannelSet, permission
    Given I am not authenticated
    Given I use DB fixture "channel-set/channel-set-checkout/change-checkout"
    When I send a PATCH request to "/api/business/{{businessId}}/channelSet/{{channelSetIdOneLink}}/checkout" with json:
      """
      {
        "checkoutId": "{{checkoutIdTwo}}"
      }
      """
    Then print last response
    Then the response status code should be 403

  Scenario: Change checkout by ChannelSet, not related to business
    Given I use DB fixture "channel-set/channel-set-checkout/change-checkout-on-not-related-to-business"
    When I send a PATCH request to "/api/business/{{businessId}}/channelSet/{{channelSetIdTwoLink}}/checkout" with json:
      """
      {
        "checkoutId": "{{checkoutIdOne}}"
      }
      """
    Then print last response
    Then the response status code should be 404
    And the response should contain json:
      """
      {
        "statusCode": 404,
        "error": "Not Found",
        "message": "ChannelSet with id '{{channelSetIdTwoLink}}' doesn't belong to business '{{businessId}}'"
      }
      """
