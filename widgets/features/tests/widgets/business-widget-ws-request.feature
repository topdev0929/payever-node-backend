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
            ],
            "tags": [],
            "name": "merchant"
          }
        ]
      }
      """

  Scenario: Respone chat summary (online members, typing members)
    Given I am watching for socket-io event "messages.ws-client.room.joined";
    Given I am watching for socket-io event "business-widgets";
    Given I use DB fixture "users"
    Given I use DB fixture "business/existing-widgets"
    Given I connect to socket.io namespace "ws" with following query
      """
      {
        "token": "{{token}}"
      }
      """
    Then I wait 100 ms while socket-io event is processed

    When I emit socket-io event "messages.ws-client.business-room.join" with:
      """
      3b8e9196-ccaa-4863-8f1e-19c18f2e4b99
      """
    Then I wait 100 ms while socket-io event is processed

    Then I look for socket-io events "messages.ws-client.room.joined" and remember as "join_events"
    And print storage key "join_events"
    Then stored value "join_events" should contain json:
    """
    ["service:business:3b8e9196-ccaa-4863-8f1e-19c18f2e4b99"]
    """

    When I emit socket-io event "business-widgets" with:
      """
      3b8e9196-ccaa-4863-8f1e-19c18f2e4b99
      """
    Then I wait 1000 ms while socket-io event is processed

    Then I look for socket-io events "business-widgets" and remember as "business-widgets"
    And print storage key "business-widgets"
    Then stored value "business-widgets" should contain json:
    """
    [
      {
        "id": "3b8e9196-ccaa-4863-8f1e-19c18f2e4b99",
        "name": "business-widgets",
        "result": true,
        "widgets": [
          {
            "__v": 0,
            "installed": false,
            "default": false,
            "installByDefault": true,
            "_id": "00e42593-2b79-4f29-82e0-9175c80b263f",
            "order": 1,
            "title": "Apps",
            "type": "apps"
          },
          {
            "__v": 0,
            "installed": false,
            "default": false,
            "installByDefault": false,
            "_id": "25e394f9-a596-4410-9403-4d111420b1c8",
            "order": 1,
            "title": "Checkout",
            "type": "checkout"
          },
          {
            "__v": 0,
            "installed": false,
            "default": false,
            "installByDefault": false,
            "_id": "358ada94-6559-4f92-9cdc-077ea46bc3d7",
            "order": 1,
            "title": "Point Of Sale",
            "type": "pos"
          },
          {
            "__v": 0,
            "installed": false,
            "default": false,
            "installByDefault": false,
            "_id": "e62b4849-b946-49ce-b863-7bcb7e8b978b",
            "order": 1,
            "title": "Connect",
            "type": "connect"
          },
          {
            "__v": 0,
            "installed": false,
            "default": false,
            "installByDefault": false,
            "_id": "e62b4849-b946-49ce-b863-7bcb7e8b978c",
            "order": 1,
            "title": "Settings",
            "type": "settings"
          },
          {
            "__v": 0,
            "installed": false,
            "default": false,
            "installByDefault": false,
            "_id": "e62b4849-b946-49ce-b863-7bcb7e8b978d",
            "order": 1,
            "title": "Transactions",
            "type": "transactions"
          }
        ]
      }
    ]
    """
    Then I disconnect all socket.io clients and wait 100 ms
