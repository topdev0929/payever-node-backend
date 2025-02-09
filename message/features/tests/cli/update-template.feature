Feature: Templates synchronization
  Background: constants
    Given I remember as "businessId" following value:
      """
      "_id-of-existing-business"
      """
    Given I remember as "templatedAppChannel1" following value:
      """
      "6441aa3b-d33f-46ad-a16a-524b8c4f2072"
      """
    Given I remember as "templatedAppChannel2" following value:
      """
      "dc9c5ce7-2272-4197-9f38-135b3e5716bb"
      """
    Given I remember as "templatedMessage1" following value:
      """
      "590b517c-85ae-4ed8-81d4-921e347a0341"
      """
    Given I remember as "templatedMessage2" following value:
      """
      "5aec40b6-4123-4581-b4a8-28f8090ba1b4"
      """
    Given I use DB fixture "business"
    Given I mock Elasticsearch method "search" with:
      """
      { "arguments": ["folder_chats"], "result": [] }
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

  Scenario: Run chat and messages templates synchronization
    Given I use DB fixture "template"
    Given I use DB fixture "templated"
    Given model "AbstractMessaging" with id "{{templatedAppChannel1}}" should contain json:
      """
      {
        "title": "App Channel of Shop #1",
        "description": "App channel description #1"
      }
      """
    Given model "AbstractMessaging" with id "{{templatedAppChannel2}}" should contain json:
      """
      {
        "title": "App Channel of Site #1",
        "description": "App channel description #2"
      }
      """
    Given model "AbstractChatMessage" with id "{{templatedMessage1}}" should contain json:
      """
      {
        "type": "text",
        "content": "1a5be2ac3063b024b86f644d6045ae2f"
      }
      """
    Given model "AbstractChatMessage" with id "{{templatedMessage2}}" should contain json:
      """
      {
        "type": "box",
        "interactive": {
          "marked": true
        }
      }
      """
    When I run command "templates:sync" with args:
      """
      ""
      """
    Then model "AbstractMessaging" with id "{{templatedAppChannel1}}" should contain json:
      """
      {
        "title": "payever Shop Bot",
        "description": "Template description"
      }
      """
    And model "AbstractMessaging" with id "{{templatedAppChannel1}}" should contain json:
      """
      {
        "title": "payever Shop Bot",
        "description": "Template description"
      }
      """

    And Stomp queue "message.event.message-model.db-operation" should contain message with json body containing json:
      """
      [
        {
          "operation": "update-one",
          "filter": {
            "_id": "{{templatedMessage1}}",
            "type": "text"
          },
          "updateQuery": {
            "$set": {
              "content": "9771d46437f0e3061c125b01baaea95f"
            }
          }
        }
      ]
      """
    And Stomp queue "message.event.message-model.db-operation" should contain message with json body containing json:
      """
      [
        {
          "operation": "create",
          "createModel": {
            "attachments": [],
            "components": [],
            "interactive.action": "https://support.payever.org/hc/en-us/articles/360023894674-How-to-setup-a-shop",
            "interactive.defaultLanguage": "en",
            "interactive.icon": "checklist",
            "interactive.translations": {
              "en": "Get a quick Tour"
            },
            "template": "41ef11af-12c0-4dad-97c5-037be794f3a0",
            "type": "box"
          }
        },
        {
          "operation": "update-one",
          "filter": {
            "_id": "{{templatedMessage2}}",
            "type": "box"          
          },
          "updateQuery": {
            "$set": {
              "interactive.action": "https://support.payever.org/hc/en-us/articles/360023894674-How-to-setup-a-shop"
            }
          }
        }
      ]
      """
