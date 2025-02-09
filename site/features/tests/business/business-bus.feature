Feature: When received message that business was created and enable channel site
  Background:
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
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

  Scenario: Receive business create message
    Given I use DB fixture "business/channel-business"
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
    When I publish in RabbitMQ channel "async_events_site_micro" message with json:
      """
      {
        "name": "users.event.business.created",
        "payload": {
          "_id": "{{businessId}}",
          "name": "Some business"
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_site_micro" channel
    And print RabbitMQ message list
    And model "Business" with id "{{businessId}}" should contain json:
      """
      {
        "name": "Some business"
      }
      """
    When I send a GET request to "/api/business/{{businessId}}/channel/site"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "enabled": false,
        "type": "site"
      }
      """
    When I send a PATCH request to "/api/business/{{businessId}}/channel/site/enable"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "enabled": true,
        "type": "site"
      }
      """
    Then I look for model "Business" by following JSON and remember as "businessUpdated":
      """
      {
        "name": "Some business"
      }
      """
    Then print storage key "businessUpdated"
    And model "Business" with id "{{businessId}}" should contain json:
      """
      {
        "subscriptions": ["*"]
      }
      """
    When I send a GET request to "/api/business/{{businessId}}/channel-set/type/site"
    Then print last response
    And the response status code should be 200
    When I send a POST request to "/api/business/{{businessId}}/channel-set/type/site"
    Then print last response
    And the response status code should be 200
    When I send a GET request to "/api/business/{{businessId}}/channel/site"
    Then print last response
    And the response status code should be 200
    Then I look for model "Business" by following JSON and remember as "businessUpdated2":
      """
      {
        "name": "Some business"
      }
      """
    Then print storage key "businessUpdated2"
    And model "Business" with id "{{businessId}}" should contain json:
      """
      {
        "channelSets": ["*"]
      }
      """

  Scenario: Receive business removed message
    Given I use DB fixture "business/remove-business"
    When I publish in RabbitMQ channel "async_events_site_micro" message with json:
      """
      {
        "name": "users.event.business.removed",
        "payload": {
          "_id": "{{businessId}}"
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_site_micro" channel
    And print RabbitMQ message list
    And model "Business" with id "{{businessId}}" should not exist

  Scenario: Received business updated method
    Given I use DB fixture "businesses"
    When I publish in RabbitMQ channel "async_events_site_micro" message with json:
      """
      {
        "name": "users.event.business.updated",
        "payload": {
          "_id": "dac8cff5-dfc5-4461-b0e3-b25839527304",
          "name": "test",
          "active": true,
          "hidden": false
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_site_micro" channel
    Then model "Business" with id "dac8cff5-dfc5-4461-b0e3-b25839527304" should contain json:
      """
      {
        "_id": "dac8cff5-dfc5-4461-b0e3-b25839527304"
      }
      """

  Scenario: Received business export
    Given I use DB fixture "business/channel-business"
    When I publish in RabbitMQ channel "async_events_site_micro" message with json:
      """
      {
        "name": "users.event.business.export",
        "payload": {
          "_id": "{{businessId}}",
          "name": "Some business"
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_site_micro" channel
    And print RabbitMQ message list
    And model "Business" with id "{{businessId}}" should contain json:
      """
      {
        "name": "Some business"
      }
      """

  Scenario: Receive business create message with wired names
    Given I use DB fixture "business/channel-business"
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
    When I publish in RabbitMQ channel "async_events_site_micro" message with json:
      """
      {
        "name": "users.event.business.created",
        "payload": {
          "_id": "{{businessId}}",
          "name": "---asdf-++??.,.,asdf----1234--2--"
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_site_micro" channel
    And print RabbitMQ message list
    And model "Business" with id "{{businessId}}" should contain json:
      """
      {
        "name": "---asdf-++??.,.,asdf----1234--2--"
      }
      """
    When I send a GET request to "/api/business/{{businessId}}/site"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      [
        {
          "domain": [],
          "isDefault": true,
          "_id": "*",
          "name": "---asdf-++??.,.,asdf----1234--2--",
          "accessConfig": {
            "isLive": false,
            "isLocked": false,
            "isPrivate": false,
            "_id": "*",
            "internalDomain": "asdf-asdf-1234-2",
            "internalDomainPattern": "asdf-asdf-1234-2",
            "site": "*",
            "createdAt": "*",
            "updatedAt": "*",
            "__v": 0,
            "id": "*"
          },
          "businessId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
          "channelSet": "*",
          "createdAt": "*",
          "updatedAt": "*",
          "__v": 1,
          "id": "*"
        }
      ]
      """
