Feature: Admin site
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
    And I remember as "defaultSiteId" following value:
      """
      "ffffffff-ffff-ffff-ffff-ffffffffffff"
      """
    And I remember as "siteId1" following value:
      """
      "11111111-1111-1111-1111-111111111111"
      """
    And I remember as "siteId2" following value:
      """
      "22222222-2222-2222-2222-222222222222"
      """
    And I remember as "anotherBusinessShopId" following value:
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
        "roles": [
          {
            "name": "admin"
          }
        ]
      }
      """

  Scenario: Only admin role has access to admin endpoint
    Given I authenticate as a user with the following data:
      """
      {
        "roles": [
          {
            "name": "merchant"
          }
        ]
      }
      """
    When I send a GET request to "/api/admin/sites"
    Then response status code should be 403

  Scenario: Get sites list for admin
    Given I use DB fixture "sites/get-list"
    When I send a GET request to "/api/admin/sites"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "page": 1,
        "documents": [
          {
            "id": "{{siteId1}}"
          },
          {
            "id": "{{siteId2}}"
          },
          {
            "id": "{{anotherBusinessShopId}}"
          }
        ],
        "total": 3
      }
      """

  Scenario: Get site by id
    Given I use DB fixture "sites/get-list"
    When I send a GET request to "/api/admin/sites/{{siteId1}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "id": "{{siteId1}}"
      }
      """
  
  Scenario: Create site
    Given I use DB fixture "sites/create-site-default-exists"
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "sites",
          {
            "name": "Test site"
          }
        ],
        "result": {}
      }
      """
    When I send a POST request to "/api/admin/sites" with json:
      """
      {
        "businessId": "{{businessId}}",
        "name": "Test site"
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "isDefault": false,
        "_id": "*",
        "name": "Test site",
        "picture": "default_picture",
        "channelSet": {
          "_id": "*"
        },
        "business": {
          "_id": "{{businessId}}"
        }
      }
      """
    And I store a response as "response"
    And print RabbitMQ message list
    And RabbitMQ exchange "async_events" should contain following ordered messages:
      """
      [
        {
          "name": "channels.event.channel-set.created",
          "payload": {
            "business": {
              "id": "{{businessId}}"
            },
            "channel": {
              "type": "site"
            },
            "id": "*"
          }
        },
        {
          "name": "channels.event.channel-set.named",
          "payload": {
            "id": "*",
            "name": "Test site"
          }
        }
      ]
      """

  Scenario: Update site, change name
    Given I use DB fixture "sites/update-site"
    And I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "roles": [
          {
            "name": "admin"
          }
        ]
      }
      """
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
    When I send a PATCH request to "/api/admin/sites/{{siteId}}" with json:
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
        }
      ]
      """

  Scenario: Admin Set default site
    Given I use DB fixture "sites/set-default-site"
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "sites",
          {}
        ],
        "result": {}
      }
      """
    When I send a PUT request to "/api/admin/sites/{{siteId}}/default"
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

  Scenario: Delete site
    Given I use DB fixture "sites/delete-site"
    Given I mock Elasticsearch method "deleteByQuery" with:
      """
      {
        "arguments": [
          "sites",
          {
            "query": {
              "match_phrase": {
                "mongoId": "{{anotherBusinessShopId}}"
              }
            }
          }
        ],
        "result": {}
      }
      """
    When I send a DELETE request to "/api/admin/sites/{{anotherBusinessShopId}}"
    Then print last response
    And the response status code should be 200
    And model "Site" with id "{{anotherBusinessShopId}}" should not exist
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
