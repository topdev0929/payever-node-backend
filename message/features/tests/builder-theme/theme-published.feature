Feature: Publish theme for application
  Background:
    And I remember as "applicationId" following value:
      """
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """

  Scenario: Published theme for application
    When I publish in RabbitMQ channel "async_events_message_micro" message with json:
      """
      {
        "name": "builder-message.event.theme.published",
        "payload": {
          "application": {
            "id": "{{applicationId}}",
            "type": "message"
          },
          "applicationTheme": {
            "application": "{{applicationId}}",
            "id": "09548226-a6ee-4e08-9517-f42ac90dc1fe",
            "theme": "6975ab97-d21d-4ddd-b476-4245230a798d"
          },
          "compiled": {
            "theme": {
              "_id": "79fd1bee-76ae-4521-bebe-bbf29d1b5746",
              "__v": 0,
              "application": "{{applicationId}}",
              "builderVersion": "2",
              "context": {},
              "createdAt": "2022-12-19T12:24:25.858Z",
              "data": {
                "productPages": "/products/:productId",
                "categoryPages": "/categories/:categoryId",
                "languages": [
                  {
                    "language": "english",
                    "active": true
                  }
                ],
                "defaultLanguage": "english"
              },
              "routing": [
                {
                  "routeId": "b6003935-78a6-42dd-9f17-9d93bec58bce",
                  "pageId": "ec3f0447-e04f-415f-bcff-90a9e5ba5141",
                  "url": "/"
                }
              ],
              "themeSource": "6975ab97-d21d-4ddd-b476-4245230a798d",
              "updatedAt": "2022-12-19T12:24:25.902Z",
              "id": "79fd1bee-76ae-4521-bebe-bbf29d1b5746"
            }
          },
          "id": "6975ab97-d21d-4ddd-b476-4245230a798d",
          "isDeployed": true,
          "theme": {
            "id": "6975ab97-d21d-4ddd-b476-4245230a798d"
          },
          "version": "1.0.0",
          "versionNumber": 1,
          "wsKey": "84199ca0-cb02-41f3-96c1-b70b1f49347b"
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_message_micro" channel

    Then look for model "AccessConfig" by following JSON and remember as "accessConfigData":
    """
    {
      "application": "{{applicationId}}"
    }
    """
    Then print storage key "accessConfigData"
    And model "AccessConfig" with id "{{accessConfigData._id}}" should contain json:
    """
    {
      "isLive": true
    }
    """
