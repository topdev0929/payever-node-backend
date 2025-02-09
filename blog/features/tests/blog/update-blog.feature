Feature: Update blog
  Background:
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    And I remember as "anotherBusinessId" following value:
      """
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    And I remember as "blogId" following value:
      """
      "11111111-1111-1111-1111-111111111111"
      """
    And I remember as "channelSetId" following value:
      """
      "dddddddd-dddd-dddd-dddd-dddddddddddd"
      """
    And I remember as "defaultblogId" following value:
      """
      "ffffffff-ffff-ffff-ffff-ffffffffffff"
      """
    And I remember as "currentBlogName" following value:
      """
      "Test update"
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

  Scenario: Update blog, change name
    Given I use DB fixture "blog/update-blog"
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
    When I send a PATCH request to "/api/business/{{businessId}}/blog/{{blogId}}" with json:
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

  Scenario: Update blog, only picture
    Given I use DB fixture "blog/update-blog"
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          	"blogs",
            {
              "isDefault": false,
              "name": "Test update",
              "picture": "new_picture",
              "_id": "11111111-1111-1111-1111-111111111111"
              
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
    When I send a PATCH request to "/api/business/{{businessId}}/blog/{{blogId}}" with json:
      """
      {
        "id": "{{blogId}}",
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
           "name": "blog.event.blog.live-toggled",
           "payload": {
             "businessId": "{{businessId}}",
             "live": true,
             "blogId": "{{blogId}}"
           }
         },
         {
           "name": "channels.event.channel-set.named",
           "payload": {
             "id": "{{businessId}}",
             "name": "new blog name"
           }
         }

       ]
      """

  Scenario: Update blog of another business
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
    When I send a PATCH request to "/api/business/{{anotherBusiness}}/blog/{{blogId}}" with json:
      """
      {
        "id": "{{blogId}}",
        "name": "new blog name"
      }
      """
    Then print last response
    And the response status code should be 403

  Scenario: Change default
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
    When I send a PATCH request to "/api/business/{{businessId}}/blog/{{blogId}}/default"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "id": "{{blogId}}",
        "isDefault": true
      }
      """
