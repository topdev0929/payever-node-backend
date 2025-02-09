Feature: Create sites
  Background:
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    And I remember as "anotherBusinessId" following value:
      """
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
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

  Scenario: Create site at another business
    Given I use DB fixture "sites/create-first-site"
    When I send a POST request to "/api/business/{{anotherBusinessId}}/site" with json:
      """
      {
        "name": "Test Site"
      }
      """
    Then print last response
    And the response status code should be 403

  Scenario: Create site first site
    Given I use DB fixture "sites/create-first-site"
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "sites",
          {
            "name": "Test Site",
            "picture": "picture_url"
          }
         ],
        "result": {}
      }
      """
    When I send a POST request to "/api/business/{{businessId}}/site" with json:
      """
      {
        "name": "Test Site",
        "picture": "picture_url"
      }
      """
    Then print last response
    And the response status code should be 201
    And the response should contain json:
      """
      {
        "isDefault": true,
        "name": "Test Site",
        "picture": "picture_url",
        "channelSet": {
          "_id": "*",
          "channel": {
            "_id": "*",
            "type": "site"
          }
        },
        "business": {
          "_id": "{{businessId}}"
        },
        "_id": "*"
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
               "customPolicy": false,
               "enabledByDefault": false,
               "type": "site"
             },
             "id": "{{response.channelSet._id}}"
           }
         },
         {
           "name": "channels.event.channel-set.named",
           "payload": {
             "id": "{{response.channelSet._id}}",
             "name": "Test Site"
           }
         },
         {
           "name": "sites.event.site.created",
           "payload": {
             "appType": "site",
             "type": "site",
             "business": {
               "id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
             },
             "default": true,
             "domain": "test-site.*",
             "id": "*",
             "name": "Test Site",
             "url": "test-site"
           }
         }
       ]
      """

  Scenario: Create site, name occupied
    Given I use DB fixture "sites/create-site-occupied-name"
    And I remember as "occupiedName" following value:
      """
      "Test Site"
      """
    When I send a POST request to "/api/business/{{businessId}}/site" with json:
      """
      {
        "name": "{{occupiedName}}",
        "picture": "picture_url"
      }
      """
    Then print last response
    And the response status code should be 400
    And the response should contain json:
      """
      {
        "statusCode": 400,
        "message": "Validation failed",
        "errors": "Site with name \"{{occupiedName}}\" already exists for business: \"{{businessId}}\""
      }
      """

  Scenario: Create site, default exists
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
    When I send a POST request to "/api/business/{{businessId}}/site" with json:
      """
      {
        "name": "Test site"
      }
      """
    Then print last response
    And the response status code should be 201
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
