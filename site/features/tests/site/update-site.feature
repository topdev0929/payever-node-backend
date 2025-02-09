Feature: Update sites
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

  Scenario: Update site, change name
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
    When I send a PATCH request to "/api/business/{{businessId}}/site/{{siteId}}" with json:
      """
      {
        "name": "new site name"
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "name": "new site name"
      }
      """
    And I store a response as "response"
    And print RabbitMQ message list
    And RabbitMQ exchange "async_events" should contain following ordered messages:
      """
      [
        {
           "name": "channels.event.channel-set.named",
           "payload": {
             "id": "{{channelSetId}}",
             "name": "new site name"
           }
        },
        {
          "name": "sites.event.site.updated",
          "payload": {
            "appType": "site",
            "type": "site",
            "business": {
              "id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
            },
            "default": false,
            "id": "cccccccc-cccc-cccc-cccc-cccccccccccc",
            "name": "new site name"
          }
        }
      ]
      """

 
  Scenario: Update site, only picture
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
    When I send a PATCH request to "/api/business/{{businessId}}/site/{{siteId}}" with json:
      """
      {
        "picture": "new_picture"
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "picture": "new_picture"
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
         },
         {
           "name": "channels.event.channel-set.named",
           "payload": {
             "id": "{{businessId}}",
             "name": "new site name"
           }
         }

       ]
      """

  Scenario: Update site of another business
    Given I use DB fixture "sites/update-site"
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "sites",
          {
          }
         ],
        "result": {}
      }
      """
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
    When I send a PATCH request to "/api/business/{{anotherBusiness}}/site/{{siteId}}" with json:
      """
      {
        "name": "new site name"
      }
      """
    Then print last response
    And the response status code should be 403

  Scenario: Set default site
    Given I use DB fixture "sites/set-default-site"
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "sites",
          {
          }
         ],
        "result": {}
      }
      """
    When I send a PUT request to "/api/business/{{businessId}}/site/{{siteId}}/default"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "isDefault": true
      }
      """
    And I store a response as "response"
    And print RabbitMQ message list
    And RabbitMQ exchange "async_events" should contain following ordered messages:
      """
      [
         {
           "name": "sites.event.site-active.updated",
           "payload": {
             "businessId": "{{businessId}}",
             "channelSetId": "*"
           }
         }
       ]
      """
    And model "Site" with id "{{defaultSiteId}}" should contain json:
      """
      {
        "isDefault": false
      }
      """