Feature: User media features
  Background:
    Given I use DB fixture "business"
    Given I remember as "businessId" following value:
      """
        "08d30292-0b3c-4b5d-a6ec-93ba43d6c81d"
      """
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
          "name": "merchant",
          "permissions": [{"businessId": "{{businessId}}", "acls": []}]
        }]
      }
      """

  Scenario: Get user subscription media
    Given I use DB fixture "attribute"
    Given I use DB fixture "subscription.media"
    Given I get file "features/data/get-subscription-media-by-user.response.json" content and remember as "response" with placeholders
    When I send a GET request to "/api/{{businessId}}/subscription?page=1&limit=3"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {{response}}
      """

  Scenario: Get user subscription media
    Given I use DB fixture "attribute"
    Given I use DB fixture "subscription.media"
    Given I get file "features/data/get-subscription-media-by-user.response.json" content and remember as "response" with placeholders
    When I send a GET request to "/api/{{businessId}}/subscription/folder/sidbhjsdbc?page=1&limit=3"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {{response}}
      """

  Scenario: Get user subscription media by attribute value
    Given I use DB fixture "attribute"
    Given I use DB fixture "subscription.media"
    Given I get file "features/data/get-user-subscription-media-by-attribute.response.json" content and remember as "response" with placeholders
    When I send a GET request to "/api/{{businessId}}/subscription/by-attribute/{{attributeId}}/{{attributeValue}}?page=1&limit=3"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {{response}}
      """

  Scenario: Get user subscription media by multiple attribute value
    Given I use DB fixture "attribute"
    Given I use DB fixture "subscription.media"
    Given I get file "features/data/get-user-subscription-media-by-attribute.response.json" content and remember as "response" with placeholders
    When I send a POST request to "/api/{{businessId}}/subscription/by-attribute?page=1&limit=3" with json:
    """
    {
      "attributes": [
        {
          "attribute": "{{attributeId}}",
          "value": "{{attributeValue}}"
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

  Scenario: Get user dropbox subscription media by multiple attribute value
    Given I use DB fixture "dropbox-attribute"
    Given I use DB fixture "dropbox-subscription.media"
    Given I get file "features/data/get-user-dropbox-subscription-media-by-attribute.response.json" content and remember as "response" with placeholders
    Given I mock Elasticsearch method "search" with:
      """
      {
        "arguments": [
          "studio-subscription-media",
          { }
        ],
        "result": {
          "body": {
            "hits": {
              "hits": []
            }
          }
        }
      }
      """
    When I send a GET request to "/api/{{businessId}}/subscription/by-attribute?limit=1&offset=0&filters%5B0%5D%5Bfield%5D=size&filters%5B0%5D%5Bcondition%5D=is&filters%5B0%5D%5Bvalue%5D=big&filters%5B1%5D%5Bfield%5D=color&filters%5B1%5D%5Bcondition%5D=isNot&filters%5B1%5D%5Bvalue%5D=red"
    Then print last response
    Then the response status code should be 200

  Scenario: Get user subscription media by id
    Given I use DB fixture "attribute"
    Given I use DB fixture "subscription.media"
    When I send a GET request to "/api/{{businessId}}/subscription/{{subscriptionMediaId}}"
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
        "subscriptionType": 0,
        "createdAt": "2020-01-01T00:00:00.000Z",
        "updatedAt": "2020-01-01T00:00:00.000Z"
      }
      """

  Scenario: Search subscribed media by name for user
    Given I use DB fixture "attribute"
    Given I use DB fixture "subscription.media"
    Given I get file "features/data/search-subscription-media-for-user.response.json" content and remember as "response" with placeholders
    When I send a GET request to "/api/{{businessId}}/subscription/search?page=1&limit=3&name= 1"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {{response}}
      """
