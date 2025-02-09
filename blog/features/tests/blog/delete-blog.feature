Feature: Delete blog
  Background:
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    And I remember as "anotherBusinessId" following value:
      """
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    And I remember as "blogId" following value:
      """
      "11111111-1111-1111-1111-111111111111"
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
          "permissions": [{"businessId": "{{businessId}}", "acls": []}]
        }]
      }
      """

  Scenario: Trying to delete last blog
    Given I use DB fixture "blog/delete-last-blog"
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
    When I send a DELETE request to "/api/business/{{businessId}}/blog/{{blogId}}"
    Then print last response
    And the response status code should be 400
    And the response should contain json:
      """
      {
           "errors": "Can not delete the last blog",
           "message": "Validation failed",
           "statusCode": 400
      }
      """
    And model "Blog" with id "{{blogId}}" should contain json:
      """
      {
        "name": "Test update"
      }
      """

  Scenario: Trying to delete blog
    Given I use DB fixture "blog/delete-blog"
    Given I mock Elasticsearch method "deleteByQuery" with:
      """
      {
        "arguments": [
          	"blogs",
            {
              "query": {
                "match_phrase": {
                  "mongoId": "11111111-1111-1111-1111-111111111111"
                }
              }
            }
        ],
        "result": ""
      }
      """
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
    When I send a DELETE request to "/api/business/{{businessId}}/blog/{{blogId}}"
    Then print last response
    And the response status code should be 200
    And model "Blog" with id "{{blogId}}" should not exist
    And print RabbitMQ message list
    And RabbitMQ exchange "async_events" should contain following ordered messages:
    """
    [
      {
        "name": "channels.event.channel-set.deleted",
        "payload": {
          "_id": "{{channelSetId}}",
          "id": "{{channelSetId}}"
        }
      }
    ]
    """
