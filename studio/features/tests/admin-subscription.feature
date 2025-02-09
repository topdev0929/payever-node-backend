Feature: Subscription media features
  Background:
    Given I use DB fixture "subscription.media"
    Given I use DB fixture "attribute"
    Given I remember as "subscriptionMediaId" following value:
      """
        "7d2a9404-e07a-477f-839d-71f591cf1317"
      """
    Given I remember as "attributeId" following value:
      """
        "64a19c1b-4ea0-4675-aafb-f50c2e3ab12d"
      """
    Given I remember as "attributeValue" following value:
      """
        "test1"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "id": "{{userId}}",
        "email": "email@test.com",
        "roles": [{
          "name": "admin",
          "permissions": [{"businessId": "{{businessId}}", "acls": []}]
        }]
      }
      """

  Scenario: Get admin subscription media pagination
    Given I get file "features/data/admin-subscription-media-pagination.response.json" content and remember as "response" with placeholders
    When I send a GET request to "/api/subscription?limit=3&page=2"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {{response}}
      """

  Scenario: Get admin subscription media by id
    When I send a GET request to "/api/subscription/{{subscriptionMediaId}}"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "_id": "7d2a9404-e07a-477f-839d-71f591cf1317",
        "url": "https://example.com/free-1.png",
        "mediaType": "image",
        "name": "image 1",
        "attributes": [
          {
            "attribute": {
              "_id": "64a19c1b-4ea0-4675-aafb-f50c2e3ab12d",
              "icon": "http://test.com/car.jpg",
              "name": "car",
              "type": "vehicle"
            },
            "value": "test1"
          }
        ],
        "subscriptionType": 0
      }
      """

  Scenario: Get admin subscription media by type
    When I send a GET request to "/api/subscription/type/free?limit=2&page=1"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      [
        {
          "_id": "*",
          "url": "https://video.com/free-5.flv",
          "mediaType": "video",
          "subscriptionType": 0,
          "createdAt": "2020-01-05T00:00:00.000Z",
          "updatedAt": "2020-01-05T00:00:00.000Z"
        },
        {
          "_id": "7d2a9404-e07a-477f-839d-71f591cf1317",
          "url": "https://example.com/free-1.png",
          "mediaType": "image",
          "subscriptionType": 0,
          "createdAt": "2020-01-01T00:00:00.000Z",
          "updatedAt": "2020-01-01T00:00:00.000Z"
        }
      ]
      """

  Scenario: Create admin subscription media
    When I send a POST request to "/api/subscription" with json:
      """
      {
        "url":"http://example.com/someimage.png",
        "mediaType": "image",
        "name": "free image 1",
        "attributes": [
          {
            "attribute": "{{attributeId}}",
            "value": "test attribute"
          }
        ]
      }
      """
    Then print last response
    Then I look for model "SubscriptionMedia" by following JSON and remember as "savedMedia":
      """
      {
        "url":"http://example.com/someimage.png",
        "mediaType": "image"
      }
      """
    And stored value "savedMedia" should contain json:
      """
      {
        "_id": "*",
        "url":"http://example.com/someimage.png",
        "createdAt": "*",
        "mediaType": "image",
        "name": "free image 1",
        "attributes": [
          {
            "attribute": "{{attributeId}}",
            "value": "test attribute"
          }
        ],
        "subscriptionType": 0,
        "updatedAt": "*"
      }
      """
    And print RabbitMQ message list
    And RabbitMQ exchange "async_events" should contain following ordered messages:
      """
      [
        {
          "name": "studio.event.subscription-media.upsert",
          "payload": {
            "id": "*"
          }
        }
      ]
      """
    Then the response status code should be 201
    And the response should contain json:
      """
      {
        "_id": "*",
        "url":"http://example.com/someimage.png",
        "createdAt": "*",
        "mediaType": "image",
        "name": "free image 1",
        "attributes": [
          {
            "attribute": {
              "_id": "{{attributeId}}",
              "name": "car",
              "type": "vehicle"
            },
            "value": "test attribute"
          }
        ],
        "subscriptionType": 0,
        "updatedAt": "*"
      }
      """

  Scenario: Delete admin subscription media by id
    When I send a DELETE request to "/api/subscription/{{subscriptionMediaId}}"
    Then print last response
    And model "SubscriptionMedia" with id "{{subscriptionMediaId}}" should not exist
    And print RabbitMQ message list
    And RabbitMQ exchange "async_events" should contain following ordered messages:
      """
      [
        {
          "name": "studio.event.subscription-media.deleted",
          "payload": {
            "id": "*"
          }
        }
      ]
      """
    Then the response status code should be 200
    And the response should contain json:
      """
      {}
      """

  Scenario: Get admin subscription media by attribute value
    Given I get file "features/data/get-user-media-by-attribute.response.json" content and remember as "response" with placeholders
    When I send a GET request to "/api/subscription/by-attribute/{{attributeId}}/{{attributeValue}}"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {{response}}
      """

  Scenario: Get admin subscription media by attribute value
    Given I get file "features/data/get-user-media-by-attribute.response.json" content and remember as "response" with placeholders
    When I send a POST request to "/api/subscription/by-attribute" with json:
    """
    {
      "attributes": [
        {
          "attribute": "64a19c1b-4ea0-4675-aafb-f50c2e3ab12d",
          "value": "test1"
        }
      ]
    }
    """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
      """
      {{response}}
      """

  Scenario: Search subscription media by name for admin
    Given I get file "features/data/search-subscription-media-for-admin.response.json" content and remember as "response" with placeholders
    When I send a GET request to "/api/subscription/search?page=1&limit=3&name= 1"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {{response}}
      """

  Scenario: Search subscription media by name for admin
    When I send a GET request to "/api/subscription/compress"
    Then print last response
    Then the response status code should be 200
  
  Scenario: Search subscription media by name for admin
    Given I get file "features/data/admin-subscription-media-pagination.response.json" content and remember as "response" with placeholders
    When I send a GET request to "/api/subscription/folder/ieurnfiuernf?limit=3&page=2"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {{response}}
      """

