Feature: Auth consumption
  Background: constants
    Given I use DB fixture "business"
    Given I use DB fixture "channel"
    Given I use DB fixture "template"
    Given I remember as "businessId" following value:
      """
      "_id-of-existing-business"
      """
    Given I mock Elasticsearch method "bulkIndex" with:
      """
      { "arguments": ["folder_chats", []], "result": [] }
      """
    Given I mock Elasticsearch method "bulkIndex" with:
      """
      { "arguments": ["messages"], "result": [] }
      """

  Scenario: Consume business granted then revoked to user
    When I publish in RabbitMQ channel "async_events_message_micro" message with json:
      """
      {
        "name": "users.event.business.updated",
        "payload": {
          "_id": "{{businessId}}",
          "name": "new Name"
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_message_micro" channel
    When I look for model "AbstractMessaging" by following JSON and remember as "chat":
    """
    {
      "_id": "id-of-support-channel"
    }
    """
    And print storage key "chat"
    Then stored value "chat" should contain json:
      """
      {
        "_id": "id-of-support-channel",
        "title": "new Name / Support Channel"
      }
      """

   