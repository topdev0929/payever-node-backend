Feature: Business delete
  Background:
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    And I remember as "blogId" following value:
      """
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    And I remember as "accessConfigId" following value:
      """
      "22222222-2222-2222-2222-222222222222"
      """
    And I remember as "domainId" following value:
      """
      "dddddddd-dddd-dddd-dddd-dddddddddddd"
      """
    And I remember as "channelSetId" following value:
      """
      "channels-etid-chan-nels-etidchannels"
      """
      
    And I authenticate as a user with the following data:
    """
    {
      "email": "email@test.com",
      "roles": [{
        "name": "merchant",
        "permissions": [{"businessId": "{{businessId}}", "acls": []}, {"businessId": "{{anotherBusinessId}}", "acls": []}]
      }]
    }
    """
    And I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "blogs",
          {}
         ],
        "result": {}
      }
      """
    And I mock Elasticsearch method "deleteByQuery" with:
      """
      {
        "arguments": [
          "blogs",
          {}
         ],
        "result": {}
      }
      """
    Given I mock "delete" method of ingress client with parameters:
      """
      {}
      """

  Scenario: Clean blog resources on business delete
    Given I use DB fixture "business/delete-business"
    Given I mock "post" method of ingress client with parameters:
      """
      {
        "kind": "Ingress",
        "apiVersion": "networking.k8s.io/v1",
        "metadata": {
          "name": "*",
          "namespace": "*",
          "labels": "*",
          "annotations": "*"
        }
      }
      """
    When I publish in RabbitMQ channel "async_events_blog_micro" message with json:
      """
      {
        "name": "users.event.business.removed",
        "payload": {
          "_id": "{{businessId}}"
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_blog_micro" channel
    And model "Business" with id "{{businessId}}" should not exist
    And model "Blog" with id "{{blogId}}" should not exist
    And model "Domain" with id "{{domainId}}" should not exist
    And model "BlogAccessConfig" with id "{{accessConfigId}}" should not exist
    And model "ChannelSet" with id "{{channelSetId}}" should not exist

