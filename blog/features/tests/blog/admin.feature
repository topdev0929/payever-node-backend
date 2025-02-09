Feature: Admin
  Background:
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    And I remember as "blogId" following value:
      """
      "11111111-1111-1111-1111-111111111111"
      """ 
    And I remember as "anotherBusinessId" following value:
      """
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    And I remember as "foreignBusinessId" following value:
      """
      "aaaaaaaa-aaaa-aaaa-bbbb-aaaaaaaaaaaa"
      """
      And I remember as "blogId1" following value:
      """
      "11111111-1111-1111-1111-111111111111"
      """
    And I remember as "blogId2" following value:
      """
      "22222222-2222-2222-2222-222222222222"
      """
    And I remember as "anotherBusinessblogId" following value:
      """
      "cccccccc-cccc-cccc-cccc-cccccccccccc"
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
          "name": "admin"
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

   Scenario: Admin Create blog in any business
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
    When I send a POST request to "/api/admin/business/{{anotherBusinessId}}/blog" with json:
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
    When I send a DELETE request to "/api/admin/business/{{businessId}}/blog/{{blogId}}"
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
   Scenario: Get blog list
    Given I use DB fixture "blog/get-list"
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
    When I send a GET request to "/api/admin/business/{{businessId}}/blog"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      [
         {
           "_id": "{{blogId1}}"
         },
         {
           "_id": "{{blogId2}}"
         }
      ]
      """
    And the response should not contain json:
      """
      [
         {
           "_id": "{{anotherBusinessblogId}}"
         }
      ]
      """
 Scenario: Update blog, change name
    Given I use DB fixture "blog/update-blog"
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
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          	"blogs",
            {
              "isDefault": false,
              "name": "new blog name",
              "picture": "*",
              "_id": "11111111-1111-1111-1111-111111111111"
              
            }
        ],
        "result": ""
      }
      """
    When I send a PATCH request to "/api/admin/business/{{businessId}}/blog/{{blogId}}" with json:
      """
      {
        "id": "{{blogId}}",
        "name": "new blog name"
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "_id": "{{blogId}}",
        "name": "new blog name"
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
             "id": "channels-etid-chan-nels-etidchannels",
             "name": "new blog name"
           }
        }
      ]
      """
