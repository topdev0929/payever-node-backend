Feature: Update sites access config
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
    And I remember as "defaultSiteId" following value:
      """
      "ffffffff-ffff-ffff-ffff-ffffffffffff"
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

  Scenario: Update site config, change isLive status
    Given I use DB fixture "sites/update-site"
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "sites",
          {
            "_id": "{{siteId}}"
          }
         ],
        "result": {}
      }
      """
    When I send a PATCH request to "/api/business/{{businessId}}/site/access/{{siteId}}" with json:
      """
      {
        "socialImage": "new-image-image",
        "isLive": true
      }
      """
    Then print last response
    And the response status code should be 200
    And I store a response as "response"
    And the response should contain json:
      """
      {
        "socialImage": "new-image-image",
        "isLive": true
      }
      """
    And I store a response as "response"
    And print RabbitMQ message list
    And RabbitMQ exchange "async_events" should contain following ordered messages:
      """
      [
        {
           "name": "sites.event.site.live-toggled",
           "payload": {
             "businessId": "{{businessId}}",
             "live": true,
             "siteId": "{{siteId}}"
           }
        }
      ]
      """
    And model "SiteAccessConfig" with id "{{response.id}}" should contain json:
      """
      {
        "socialImage": "new-image-image"
      }
      """

  Scenario: Update site access config, already isLive
    Given I use DB fixture "sites/update-site-access-already-live"
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "sites",
          {
            "_id": "{{siteId}}"
          }
         ],
        "result": {}
      }
      """
    When I send a PATCH request to "/api/business/{{businessId}}/site/access/{{siteId}}" with json:
      """
      {
        "isLive": true
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "isLive": true
      }
      """
    And I store a response as "response"
    And print RabbitMQ message list
    And RabbitMQ exchange "async_events" should not contain following messages:
      """
      [
        {
           "name": "sites.event.site.live-toggled",
           "payload": {
             "businessId": "{{businessId}}",
             "live": true,
             "siteId": "{{siteId}}"
           }
        }
      ]
      """

  Scenario: Update site config, change password
    Given I use DB fixture "sites/update-site"
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "sites",
          {
            "_id": "{{siteId}}"
          }
         ],
        "result": {}
      }
      """
    When I send a PATCH request to "/api/business/{{businessId}}/site/access/{{siteId}}" with json:
      """
      {
        "privatePassword": "new-password"
      }
      """
    Then print last response
    And the response status code should be 200
    And I store a response as "response"
    And print RabbitMQ message list
    And RabbitMQ exchange "async_events" should contain following ordered messages:
      """
      [
        {
          "name": "sites.event.password.updated",
          "payload": {
            "businessId": "{{businessId}}",
            "password": "new-password",
            "siteId": "{{siteId}}"
          }
        }
      ]
      """
    And RabbitMQ exchange "async_events" should not contain following messages:
      """
      [
        {
           "name": "sites.event.password.toggled"
        }
      ]
      """
    And model "SiteAccessConfig" with id "{{response.id}}" should contain json:
      """
      {
        "privatePassword": "new-password"
      }
      """

  Scenario: Update site config, make private
    Given I use DB fixture "sites/update-site"
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "sites",
          {
            "_id": "{{siteId}}"
          }
         ],
        "result": {}
      }
      """
    When I send a PATCH request to "/api/business/{{businessId}}/site/access/{{siteId}}" with json:
      """
      {
        "isPrivate": true
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "isPrivate": true
      }
      """
    And I store a response as "response"
    And print RabbitMQ message list
    And RabbitMQ exchange "async_events" should contain following ordered messages:
      """
      [
        {
          "name": "sites.event.password.updated",
          "payload": {
            "businessId": "{{businessId}}",
            "siteId": "{{siteId}}"
          }
        },
        {
           "name": "sites.event.password.toggled",
           "payload": {
             "businessId": "{{businessId}}",
             "siteId": "{{siteId}}"
           }
        }
      ]
      """

  Scenario: Update site config, of another business
    Given I use DB fixture "sites/update-site"
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
    When I send a PATCH request to "/api/business/{{anotherBusinessId}}/site/access/{{siteId}}" with json:
      """
      {
        "isLive": true
      }
      """
    Then print last response
    And the response status code should be 403
