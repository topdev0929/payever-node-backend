Feature: Get member info by userId/contactId
  Background: constants
    Given I load constants from "features/fixtures/const.ts"
    Given I use DB fixture "business"
    Given I use DB fixture "channel"
    Given I use DB fixture "user"
    Given I use DB fixture "contacts"

  Scenario: Get members of common channel by userId
    Given I authenticate as a user with the following data:
      """
      {
        "id": "{{ID_OF_USER_1}}",
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
    When I send a GET request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/channel/{{ID_OF_CHANNEL}}/members/user/{{ID_OF_USER_1}}"
    Then print last response
    Then response status code should be 200
    And the response should contain json:
      """
      {
        "contact": null,
        "contactId": null,
        "user": "{{ID_OF_USER_1}}",
        "userAccount": {
          "email": "john@example.com",
          "firstName": "John",
          "lastName": "Doe",
          "logo": "john.png",
          "phone": "+394233123"
        }
      }
      """

  Scenario: Get members of common channel by contactId
    Given I authenticate as a user with the following data:
      """
      {
        "id": "{{ID_OF_USER_1}}",
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
    When I send a GET request to "/api/business/{{ID_OF_EXISTING_BUSINESS}}/messaging/channel/{{ID_OF_CHANNEL}}/members/contact/{{ID_OF_CONTACT}}"
    Then print last response
    Then response status code should be 200
    And the response should contain json:
      """
      {
        "contact": {
          "_id": "{{ID_OF_CONTACT}}",
          "business": "_id-of-existing-business",
          "name": "John Doe",
          "createdAt": "*",
          "updatedAt": "*"
        },
        "contactId": "{{ID_OF_CONTACT}}",
        "user": null,
        "userAccount": {
          "firstName": "John Doe"
        }
      }
      """
