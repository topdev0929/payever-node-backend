Feature: Admin channel
  Background:
    Given I use DB fixture "admin-channel"
    Given I remember as "channelId1" following value:
      """
      "channel-id-1"
      """
    Given I remember as "channelId2" following value:
      """
      "channel-id-2"
      """
    Given I remember as "channelId3" following value:
      """
      "channel-id-3"
      """
    And I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "roles": [
          {
            "name": "admin"
          }
        ]
      }
      """

  Scenario: Only admin role has access to admin endpoint
    Given I authenticate as a user with the following data:
      """
      {
        "roles": [
          {
            "name": "merchant"
          }
        ]
      }
      """
    When I send a GET request to "/api/admin/channels"
    Then response status code should be 403

  Scenario: Get all channels
    When I send a GET request to "/api/admin/channels"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "documents": [
          {
            "_id": "{{channelId1}}"
          },
          {
            "_id": "{{channelId2}}"
          },
          {
            "_id": "{{channelId3}}"
          }
        ],
        "total": 3
      }
      """

  Scenario: Get channel by id
    When I send a GET request to "/api/admin/channels/{{channelId1}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "_id": "{{channelId1}}",
        "legacyId": 10,
        "type": "video",
        "enabled": true,
        "enabledByDefault": true,
        "customPolicy": true
      }
      """

  Scenario: Create new channel
    When I send a POST request to "/api/admin/channels" with json:
      """
      {
        "legacyId": 33,
        "type": "mobilede",
        "enabled": true,
        "enabledByDefault": true,
        "customPolicy": true
      }
      """
    Then print last response
    And I store a response as "response"
    And response status code should be 200
    And the response should contain json:
      """
      {
        "_id": "*",
        "legacyId": 33,
        "type": "mobilede",
        "enabled": true,
        "enabledByDefault": true,
        "customPolicy": true
      }
      """
    When I send a GET request to "/api/admin/channels/{{response._id}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "_id": "{{response._id}}",
        "legacyId": 33,
        "type": "mobilede",
        "enabled": true,
        "enabledByDefault": true,
        "customPolicy": true
      }
      """

  Scenario: Update a channel
    When I send a PATCH request to "/api/admin/channels/{{channelId1}}" with json:
      """
      {
        "legacyId": 33,
        "type": "mobilede-changed",
        "enabled": false,
        "enabledByDefault": false,
        "customPolicy": false
      }
      """
    Then print last response
    And response status code should be 200
    And the response should contain json:
      """
      {
        "_id": "{{channelId1}}",
        "legacyId": 33,
        "type": "mobilede-changed",
        "enabled": false,
        "enabledByDefault": false,
        "customPolicy": false
      }
      """
    When I send a GET request to "/api/admin/channels/{{channelId1}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "_id": "{{channelId1}}",
        "legacyId": 33,
        "type": "mobilede-changed",
        "enabled": false,
        "enabledByDefault": false,
        "customPolicy": false
      }
      """

  Scenario: Delete channel
    When I send a DELETE request to "/api/admin/channels/{{channelId1}}"
    Then print last response
    And the response status code should be 200
    When I send a GET request to "/api/admin/channels/{{channelId1}}"
    Then print last response
    And the response status code should be 404
