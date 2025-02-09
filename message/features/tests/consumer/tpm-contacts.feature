Feature: TPM contacts consumption
  Background: constants
    Given I remember as "businessId" following value:
      """
      "_id-of-existing-business"
      """
    Given I remember as "contactId" following value:
      """
      "3bddb299-8bb0-41e5-beeb-d23c1fd5ef37"
      """

  Scenario: Consume contact created
    Given I use DB fixture "business"
    Given I publish in RabbitMQ channel "async_events_message_micro" message with json:
      """
      {
        "name": "third-party-messenger.event.contact.created",
        "payload": {
          "_id": "{{contactId}}",
          "avatar": "john-doe.png",
          "business": "{{businessId}}",
          "communications": [
            {
              "identifier": "waId8123498172938",
              "integrationName": "whatsapp"
            }
          ],
          "status": "online",
          "name": "John Doe"
        }
      }
      """
    When I process messages from RabbitMQ "async_events_message_micro" channel
    And print RabbitMQ exchange "async_events" message list
    Then model "Contact" with id "{{contactId}}" should contain json:
      """
      {
        "business": "{{businessId}}",
        "name": "John Doe"
      }
      """

  Scenario: Consume contact updated
    Given I use DB fixture "business"
    Given I use DB fixture "contacts"
    When I publish in RabbitMQ channel "async_events_message_micro" message with json:
      """
      {
        "name": "third-party-messenger.event.contact.updated",
        "payload": {
          "_id": "{{contactId}}",
          "avatar": "john-doe-2.png",
          "business": "{{businessId}}",
          "communications": [
            {
              "identifier": "waId8123498172938",
              "integrationName": "whatsapp"
            }
          ],
          "status": "online",
          "name": "Jack Doe"
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_message_micro" channel
    And print RabbitMQ exchange "async_events" message list
    And model "Contact" with id "{{contactId}}" should contain json:
      """
      {
        "name": "Jack Doe",
        "avatar": "john-doe-2.png"
      }
      """
  
  Scenario: Consume contact deleted, should do nothing
    Given I use DB fixture "business"
    Given I use DB fixture "contacts"
    When I publish in RabbitMQ channel "async_events_message_micro" message with json:
      """
      {
        "name": "third-party-messenger.event.contact.deleted",
        "payload": {
          "_id": "{{contactId}}",
          "avatar": "john-doe.png",
          "business": "{{businessId}}",
          "communications": [
            {
              "identifier": "waId8123498172938",
              "integrationName": "whatsapp"
            }
          ],
          "status": "online",
          "name": "John Doe"
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_message_micro" channel
    And print RabbitMQ exchange "async_events" message list
    And model "Contact" with id "{{contactId}}" should contain json:
      """
      {
        "name": "John Doe"
      }
      """
