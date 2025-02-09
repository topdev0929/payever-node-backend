Feature: Channel set API

  Background:
    Given I remember as "channelSetId" following value:
      """
      "a888336c-fe1f-439c-b13c-f351db6bbc2e"
      """
    Given I remember as "channelSetName" following value:
      """
      "Shop name #1"
      """
    Given I remember as "businessId" following value:
      """
      "a803d4c3-c447-4aab-a8c7-c7f184a8e77f"
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

  Scenario: Update existing
    Given I use DB fixture "channel-set/channel-set-bus-message/channel-set.created/existing-channel-set-shop"
    When I send a PATCH request to "/api/business/{{businessId}}/channelSet/{{channelSetId}}" with json:
      """
      {
        "active": true
      }
      """
    Then print last response
    Then the response status code should be 200
    Then model "ChannelSet" with id "{{channelSetId}}" should contain json:
      """
      {
        "_id": "{{channelSetId}}",
        "active": true
      }
      """

  Scenario: Update existing with wrong id
    Given I use DB fixture "channel-set/channel-set-bus-message/channel-set.created/existing-channel-set-shop"
    When I send a PATCH request to "/api/business/{{businessId}}/channelSet/a888336c-fe1f-439c-b13c-f351db6bbc2f" with json:
      """
      {
        "active": true
      }
      """
    Then print last response
    Then the response status code should be 404
