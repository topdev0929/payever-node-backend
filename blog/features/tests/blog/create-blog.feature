Feature: Create blog
  Background:
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    And I remember as "anotherBusinessId" following value:
      """
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    And I remember as "foreignBusinessId" following value:
      """
      "aaaaaaaa-aaaa-aaaa-bbbb-aaaaaaaaaaaa"
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

  Scenario: Create blog at another business
    Given I use DB fixture "blog/create-first-blog"
    When I send a POST request to "/api/business/{{foreignBusinessId}}/blog"
    Then print last response
    And the response status code should be 403

  Scenario: Create blog first blog
    Given I use DB fixture "blog/create-first-blog"
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          	"blogs",
            {
              "isDefault": false,
              "name": "Test Blog",
              "picture": "picture_url",
              "business": {
                "_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
              },
              "channelSet": {
                "channel": {
                  "type": "blog"
                }
              }
            }
        ],
        "result": ""
      }
      """
    When I send a POST request to "/api/business/{{anotherBusinessId}}/blog" with json:
      """
      {
        "name": "Test Blog",
        "picture": "picture_url"
      }
      """

    Then print last response
    And the response status code should be 201
    And the response should contain json:
      """
      {
        "isDefault": false,
        "name": "Test Blog",
        "picture": "picture_url",
        "channelSet": {
          "_id": "*",
          "channel": "*"
        },
        "business": {
          "_id": "{{anotherBusinessId}}"
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
               "id": "{{anotherBusinessId}}"
             },
             "channel": {
               "customPolicy": false,
               "enabledByDefault": false,
               "type": "blog"
             },
             "id": "{{response.channelSet._id}}"
           }
         },
         {
           "name": "channels.event.channel-set.named",
           "payload": {
             "id": "{{response.channelSet._id}}",
             "name": "Test Blog"
           }
         }
       ]
      """

  Scenario: Create blog, name occupied
    Given I use DB fixture "blog/create-blog-occupied-name"
    And I remember as "occupiedName" following value:
      """
      "Test Blog"
      """
    When I send a POST request to "/api/business/{{businessId}}/blog" with json:
      """
      {
        "name": "{{occupiedName}}",
        "picture": "picture_url"
      }
      """
    Then print last response
    And the response status code should be 201
    And the response should contain json:
      """
      {
        "isDefault": false,
        "name": "Test Blog-*",
        "picture": "picture_url",
        "channelSet": {
          "_id": "*",
          "channel": "*"
        },
        "business": {
          "_id": "{{businessId}}"
        },
        "_id": "*"
      }
      """

  Scenario: Create blog, default exists
    Given I use DB fixture "blog/create-blog-default-exists"
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          	"blogs",
            {
              "isDefault": false,
              "name": "Test blog",
              "picture": null,
              "business": {
                "_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
              },
              "channelSet": {
                "channel": {
                  "type": "blog"
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
    When I send a POST request to "/api/business/{{anotherBusinessId}}/blog" with json:
      """
      {
        "name": "Test blog"
      }
      """
    Then print last response
    And the response status code should be 201
    And the response should contain json:
      """
      {
        "isDefault": false,
        "_id": "*",
        "name": "Test blog",
        "channelSet": {
          "_id": "*"
        },
        "business": {
          "_id": "{{anotherBusinessId}}"
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
               "id": "{{anotherBusinessId}}"
             },
             "channel": {
               "type": "blog"
             },
             "id": "*"
           }
         },
         {
           "name": "channels.event.channel-set.named",
           "payload": {
             "id": "*",
             "name": "Test blog"
           }
         }
      ]
      """
