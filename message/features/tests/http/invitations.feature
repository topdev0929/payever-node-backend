Feature: Invitations
  Background: constants
    Given I load constants from "features/fixtures/const.ts"
    Given I authenticate as a user with the following data:
      """
      {
        "id": "{{ID_OF_CONTACT_2}}",
        "email": "testcases@payever.de",
        "firstName": "Test",
        "lastName": "Test",
        "roles": [
          {
            "permissions": [
              {
                "businessId": "{{ID_OF_EXISTING_BUSINESS}}",
                "acls": []
              }
            ],
            "tags": [],
            "name": "merchant"
          }
        ]
      }
      """

  Scenario: Get invitation by code
    Given I use DB fixture "channel"
    When I send a GET request to "/api/invitations/{{INVITE_CODE_OF_CHANNEL_2}}"
    Then print last response
    Then response status code should be 200
    And I store a response as "response"
    And the response should contain json:
      """
      {
        "code": "{{INVITE_CODE_OF_CHANNEL_2}}",
        "messaging": {
          "_id": "{{ID_OF_CHANNEL_2}}",
          "photo": "",
          "title": "Private-channel",
          "type": "channel"
        }
      }
      """