Feature: Contacts controller
  Background: constants
    Given I load constants from "features/fixtures/const.ts"
    Given I remember as "businessId" following value:
      """
      "_id-of-existing-business"
      """
    Given I remember as "contactId" following value:
      """
      "3bddb299-8bb0-41e5-beeb-d23c1fd5ef37"
      """
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
                "businessId": "{{businessId}}",
                "acls": []
              }
            ],
            "tags": [],
            "name": "merchant"
          }
        ]
      }
      """
    Given I use DB fixture "business"
    Given I use DB fixture "integrations"
    Given I use DB fixture "subscriptions"

  Scenario: Create contact
    When I send a POST request to "/api/business/{{businessId}}/contacts" with json:
      """
      {
        "avatar": "john-doe.png",
        "name": "John Doe",
        "communications": []
      }
      """
    Then the response code should be 201
    And I store a response as "response"
    And model "Contact" with id "{{response._id}}" should contain json:
      """
      {
        "name": "John Doe",
        "avatar": "john-doe.png",
        "communications": []
      }
      """
    And Stomp queue "message.event.contact.created" should contain message with json body containing json:
      """
      [{
        "_id": "{{response._id}}",
        "name": "John Doe",
        "avatar": "john-doe.png",
        "communications": []
      }]
      """

  Scenario: Find all contacts of business
    Given I use DB fixture "contacts"
    When I send a GET request to "/api/business/{{businessId}}/contacts"
    Then the response code should be 200
    And the response should contain json:
      """
      [{
        "_id": "{{contactId}}",
        "business": "{{businessId}}",
        "name": "John Doe",
        "communications": []
      }]
      """

  Scenario: Find contact by email
    Given I use DB fixture "contacts"
    Given I remember as "filter" following value:
      """
      "{\"communications.integrationName\": \"email\", \"communications.identifier\": \"john@example.com\"}"
      """
    When I send a GET request to "/api/business/{{businessId}}/contacts?filter={{filter}}"
    Then the response code should be 200
    And the response should contain json:
      """
      [{
        "_id": "{{ID_OF_CONTACT}}"
      }]
      """

  Scenario: Search all contacts of business
    Given I use DB fixture "contacts"
    When I send a GET request to "/api/business/{{businessId}}/contacts/search?search=John"
    Then the response code should be 200
    And the response should contain json:
      """
      [{
        "_id": "{{contactId}}",
        "business": "{{businessId}}",
        "name": "John Doe",
        "communications": []
      }]
      """

  Scenario: Update contact
    Given I use DB fixture "contacts"
    When I send a PATCH request to "/api/business/{{businessId}}/contacts/{{contactId}}" with json:
      """
      {
        "avatar": "john-doe-2.png",
        "name": "Jack Doe",
        "communications": [{
          "identifier": "+79844213",
          "integrationName": "whatsapp"
        }]
      }
      """
    Then the response code should be 200
    And I store a response as "response"
    And model "Contact" with id "{{response._id}}" should contain json:
      """
      {
        "name": "Jack Doe",
        "avatar": "john-doe-2.png",
        "communications": [{
          "identifier": "+79844213",
          "integrationName": "whatsapp"
        }]
      }
      """
    And Stomp queue "message.event.contact.updated" should contain message with json body containing json:
      """
      [{
        "_id": "{{response._id}}",
        "name": "Jack Doe",
        "avatar": "john-doe-2.png",
        "communications": [{
          "identifier": "+79844213",
          "integrationName": "whatsapp"
        }]
      }]
      """

  Scenario: Delete contact
    Given I use DB fixture "contacts"
    When I send a DELETE request to "/api/business/{{businessId}}/contacts/{{contactId}}"
    Then the response code should be 204
    And model "Contact" with id "{{contactId}}" should not exist
