Feature: Post state
  Background:
    Given I mock Elasticsearch method "bulkIndex" with:
      """
      { "arguments": ["post-folder", []], "result": [] }
      """
    Given I mock Elasticsearch method "singleIndex" with:
      """
      { "arguments": ["post-folder"], "result": [] }
      """
    Given I mock Elasticsearch method "search" with:
      """
      { "arguments": ["post-folder"], "result": [] }
      """
    Given I mock Elasticsearch method "deleteByQuery" with:
      """
      { "arguments": ["post-folder"], "result": [] }
      """
    Given I remember as "businessId" following value:
      """
        "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "postId1" following value:
      """
        "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    Given I remember as "postId2" following value:
      """
        "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@email.com",
        "roles": [
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "{{businessId}}",
                "acls": []
              }
            ]
          }
        ]
      }
      """

  Scenario: Add post state
    Given I use DB fixture "post"
    Given I publish in RabbitMQ channel "async_events_social_micro" message with json:
      """
      {
        "name":"third-party-social.event.post-state.update",
        "payload": {
          "error": {
            "code": 1,
            "error": "Unsupported Media",
            "message": "png image not supported"
          },
          "integrationName":"twitter",
          "postId":"{{postId1}}",
          "status":"failed"
        }
      }
      """
    Given I publish in RabbitMQ channel "async_events_social_micro" message with json:
      """
      {
        "name":"third-party-social.event.post-state.update",
        "payload": {
          "integrationName":"instagram-posts",
          "postId":"{{postId1}}",
          "status":"succeeded"
        }
      }
      """
    And I process messages from RabbitMQ "async_events_social_micro" channel
    Then model "Post" with id "{{postId1}}" should contain json:
      """
      {
        "postState": [
          {
            "error": {
              "code": 1,
              "error": "Unsupported Media",
              "message": "png image not supported"
            },
            "integrationName":"twitter",
            "status":"failed"
          },
          {
            "integrationName":"instagram-posts",
            "status":"succeeded"
          }
        ]
      }
      """

  Scenario: Change status to deleted
    Given I use DB fixture "post"
    Given I publish in RabbitMQ channel "async_events_social_micro" message with json:
      """
      {
        "name":"third-party-social.event.post-state.update",
        "payload": {
          "integrationName":"twitter",
          "postId":"{{postId2}}",
          "status":"deleted"
        }
      }
      """
    And I process messages from RabbitMQ "async_events_social_micro" channel
    Then model "Post" with id "{{postId2}}" should contain json:
      """
      {
        "postState": [
          {
            "integrationName":"twitter",
            "status":"deleted"
          },
          {
            "integrationName":"instagram-posts",
            "status":"succeeded"
          }
        ]
      }
      """