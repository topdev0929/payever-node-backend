Feature: Delete sites
  Background:
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    And I remember as "anotherBusinessId" following value:
      """
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    And I remember as "siteId" following value:
      """
      "cccccccc-cccc-cccc-cccc-cccccccccccc"
      """
    And I remember as "channelSetId" following value:
      """
      "dddddddd-dddd-dddd-dddd-dddddddddddd"
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

  Scenario: Trying to delete last site
    Given I use DB fixture "sites/delete-last-site"
    When I send a DELETE request to "/api/business/{{businessId}}/site/{{siteId}}"
    Then print last response
    And the response status code should be 400
    And the response should contain json:
      """
      {
         "statusCode": 400,
         "message": "Validation failed",
         "errors": "Can not delete the last site"
      }
      """
    And model "Site" with id "{{siteId}}" should contain json:
      """
      {
        "name": "Test update"
      }
      """

  Scenario: Trying to delete last site
    Given I use DB fixture "sites/delete-site"
    Given I mock Elasticsearch method "deleteByQuery" with:
      """
      {
        "arguments": [
          "sites",
          {
            "query": {
              "match_phrase": {
                "mongoId": "{{siteId}}"
              }
            }
          }
         ],
        "result": {}
      }
      """
    When I send a DELETE request to "/api/business/{{businessId}}/site/{{siteId}}"
    Then print last response
    And the response status code should be 200
    And model "Site" with id "{{siteId}}" should not exist
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
        },
        {
          "name": "sites.event.site.removed",
          "payload": {
            "appType": "site",
            "type": "site",
            "business": {
              "id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
            },
            "id": "*"
          }
        }
      ]
      """

  Scenario: Trying to delete site of another business
    Given I use DB fixture "sites/delete-last-site"
    And I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "roles": [{
          "name": "merchant",
          "permissions": [{"businessId": "{{anotherBusinessId}}", "acls": []}]
        }]
      }
      """
    When I send a DELETE request to "/api/business/{{anotherBusinessId}}/site/{{siteId}}"
    Then print last response
    And the response status code should be 403
    And model "Site" with id "{{siteId}}" should contain json:
      """
      {
        "name": "Test update"
      }
      """
