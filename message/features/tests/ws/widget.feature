Feature: Ws widget
  Background: constants
    Given I load constants from "features/fixtures/const.ts"
    Given I use DB fixture "business"
    Given I use DB fixture "integration-channels"
    Given I generate an access token using the following data and remember it as "token_for_guest":
      """
      {
        "roles": [
          {
            "name": "guest",
            "applications": []
          }
        ]
      }
      """
    Given I mock Elasticsearch method "bulkIndex" with:
      """
      {
        "arguments": [
          "messages"
        ],
        "result": []
      }
      """

  Scenario: Connect to widget
    Given I connect to socket.io namespace "widget" with following query:
      """
      {
        "token": "{{token_for_guest}}",
        "businessId": "{{ID_OF_EXISTING_BUSINESS}}"
      }
      """
    And I wait 100 ms while socket-io event is processed
    And stored value "$socket-io > results > authenticated" should contain json:
      """
      {
        "integrationChannels": [{
          "_id": "{{ID_OF_INTEGRATION_CHANNEL_1}}"
        }]
      }
      """
    Then I disconnect all socket.io clients and wait 100 ms
