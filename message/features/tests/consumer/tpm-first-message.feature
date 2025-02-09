Feature: TPM First message
  Background: constants
    Given I remember as "businessId" following value:
      """
      "_id-of-existing-business"
      """
    Given I remember as "contactId" following value:
      """
      "3bddb299-8bb0-41e5-beeb-d23c1fd5ef37"
      """
    Given I remember as "chatId" following value:
      """
      "2ccbe226-f626-4f5c-8389-1710b71dba7a"
      """
    Given I remember as "salt" following value:
      """
      "pba5LieAb/OmkRGpuEqrEM8u6LYFJeMChlU/vOffvY2jAM/nOv/gQVFicWdRHIo98eYHCOEsBSrU8JVlqYJkoOH+IOeiH/JyRogFtwBt/GZmY6S5BHAUMKXhC8Ow1kP2"
      """
    Given I remember as "encryptContent" following value:
      """
      "9771d46437f0e3061c125b01baaea95f"
      """
    Given I mock Elasticsearch method "singleIndex" with:
      """
      { "arguments": ["messages"], "result": [] }
      """
    Given I mock Elasticsearch method "bulkIndex" with:
      """
      { "arguments": ["messages"], "result": [] }
      """
    Given I mock Elasticsearch method "deleteByQuery" with:
      """
      { "arguments": ["messages"], "result": [] }
      """
    Given I mock Elasticsearch method "search" with:
      """
      { "arguments": ["folder_chats"], "result": [] }
      """
    Given I mock Elasticsearch method "singleIndex" with:
      """
      { "arguments": ["folder_chats"], "result": [] }
      """

  Scenario: Consume first message created
    Given I use DB fixture "business"
    Given I use DB fixture "integrations"
    When I publish in Stomp queue "/queue/third-party-messenger.event.first-message.created" message with json:
      """
      {
        "contact": {
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

        },
        "chat": {
          "_id": "{{chatId}}",
          "business": "{{businessId}}",
          "integrationName": "whatsapp",
          "salt": "{{salt}}",
          "title": "new-chat-name",
          "contact": "{{contactId}}"
        },
        "message": {
          "_id": "{{messageId}}",
          "attachments": [],
          "chat": "{{chatId}}",
          "content": "{{encryptContent}}",
          "contentType":"sample-content-type",
          "contentPayload":"sample-content-payload",
          "sender": "{{contactId}}",
          "sentAt": "2021-04-05T11:08:08.626Z",
          "status": "sent",
          "businessId": "{{businessId}}",
          "integrationName": "whatsapp"
        }
      }
      """
    Then I process messages from Stomp queue "/queue/third-party-messenger.event.first-message.created"
    And model "Contact" with id "{{contactId}}" should contain json:
      """
      {
        "business": "{{businessId}}",
        "name": "John Doe"
      }
      """
    Then model "AbstractMessaging" with id "{{chatId}}" should contain json:
      """
      {
        "title": "new-chat-name",
        "contact": "{{contactId}}"
      }
      """
    And Stomp queue "message.event.message-model.db-operation" should contain message with json body containing json:
      """
      [
        {
          "operation": "create",
          "createModel": {
            "_id": "{{messageId}}",
            "chat": "{{chatId}}",
            "attachments": [],
            "status": "sent",
            "content": "{{encryptContent}}",
            "contentType":"sample-content-type",
            "contentPayload":"sample-content-payload",
            "sender": "{{contactId}}",
            "sentAt": "2021-04-05T11:08:08.626Z"
          }
        }
      ]
      """
