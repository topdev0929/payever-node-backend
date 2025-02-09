Feature: Ws chat summary request feature
  Background: constants
    Given I generate an access token using the following data and remember it as "token":
      """
      {
        "id": "00000000-0000-0000-0000-000000000000",
        "email": "testcases@payever.de",
        "firstName": "Test",
        "lastName": "Test",
        "roles": [
          {
            "permissions": [
              {
                "businessId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
                "acls": []
              }
            ],
            "tags": [],
            "name": "merchant"
          }
        ]
      }
      """

  Scenario: Respone chat summary (online members, typing members)
    Given I use DB fixture "users"
    Given I use DB fixture "social-app/social-post"
    Given I connect to socket.io namespace "ws" with following query
      """
      {
        "token": "{{token}}"
      }
      """
    Then I wait 100 ms while socket-io event is processed

    When I emit socket-io event "messages.ws-client.business-room.join" with:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Then I wait 100 ms while socket-io event is processed

    When I emit socket-io event "business-default-social-data" with json:
      """
      {
        "token": "{{token}}",
        "id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      }
      """
    Then I wait 1000 ms while socket-io event is processed
