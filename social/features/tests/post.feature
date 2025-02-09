Feature: Post
  Background:
    Given I load constants from "features/fixtures/const.ts"
    Given I mock Elasticsearch method "bulkIndex" with:
      """
      { "arguments": ["post-folder", []], "result": [] }
      """
    Given I mock Elasticsearch method "singleIndex" with:
      """
      { "arguments": ["post-folder"], "result": [] }
      """
    Given I mock Elasticsearch method "search" with:
      """
      { "arguments": ["post-folder"], "result": [] }
      """
    Given I mock Elasticsearch method "deleteByQuery" with:
      """
      { "arguments": ["post-folder"], "result": [] }
      """
    Given I remember as "businessId" following value:
      """
        "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "postId" following value:
      """
        "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
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

  Scenario: Create new post
    Given I use DB fixture "post"
    When I send a POST request to "/business/{{businessId}}/post" with json:
      """
      {
        "content": "content",
        "media": "media",
        "channelSet": [],
        "postedAt": "2021-07-19T06:29:20.820Z",
        "toBePostedAt": null,
        "status": "postnow",
        "title": "title",
        "type": "post"
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
      {
        "businessId": "{{businessId}}",
        "content": "content",
        "media": "media",
        "postedAt": "2021-07-19T06:29:20.820Z",
        "toBePostedAt": null,
        "status": "postnow",
        "title": "title",
        "type": "post",
        "_id": "*"
      }
    """
    And store a response as "response"
    And model "Post" with id "{{response._id}}" should contain json:
      """
      {
        "content": "content",
        "media": "media",
        "postedAt": "2021-07-19T06:29:20.820Z",
        "toBePostedAt": null,
        "status": "postnow",
        "title": "title",
        "type": "post"
      }
      """

  Scenario: Create new post with default postedAt time
    Given I use DB fixture "post"
    When I send a POST request to "/business/{{businessId}}/post" with json:
      """
      {
        "content": "content",
        "media": "media",
        "channelSet": [],
        "toBePostedAt": "2021-07-19T06:29:20.820Z",
        "status": "postnow",
        "title": "title",
        "type": "post"
      }
      """
    Then print last response
    And the response status code should be 200
    And store a response as "response"
    And model "Post" with id "{{response._id}}" should contain json:
      """
      {
        "content": "content",
        "media": "media",
        "postedAt": "*",
        "toBePostedAt": "2021-07-19T06:29:20.820Z",
        "status": "postnow",
        "title": "title",
        "type": "post"
      }
      """

  Scenario: create post using media-post api
    Given I use DB fixture "post"
    When I send a POST request to "/business/{{businessId}}/post/media-post?post=%7B%22type%22%3A%22post%22%2C%22content%22%3A%22fb%20video%22%2C%22mediaType%22%3A%20%22image%22%2C%22channelSet%22%3A%5B%2235fcb0f5-b404-420e-bb3a-67b2fe82c12a%22%5D%2C%22status%22%3A%22postnow%22%7D" with form data:
    |||
    Then print last response
    And the response status code should be 200
    And store a response as "response"
    And the response should contain json:
    """
    {
      "channelSet": [],
      "failedIntegrations": [],
      "media": [],
      "type": "post",
      "content": "fb video",
      "status": "postnow",
      "businessId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
      "sentStatus": "Sent",
      "attachments": [],
      "id": "*"
    }
    """
    And print RabbitMQ exchange "social_folders" message list
    And RabbitMQ exchange "social_folders" should contain following ordered messages:
      """
      [
        {
          "name": "social.folder-action-create-document",
          "payload": {
            "esFolderItemPrototype": {
              "_id": "*",
              "attachments": [],
              "businessId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
              "channelSet": [],
              "content": "fb video",
              "media": [],
              "postedAt": "*",
              "sentStatus": "Sent",
              "serviceEntityId": "{{response._id}}",
              "status": "postnow",
              "type": "post",
              "parentFolderId": null,
              "sortDate": "*"
            }
          }
        }
      ]
      """
  Scenario: updalicate post
    Given I use DB fixture "post"
    When I send a POST request to "/business/{{businessId}}/post/duplicate-post" with json:
    """
    { "id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2" }
    """
    Then print last response
    And the response status code should be 200
    And store a response as "response"
    And the response should contain json:
    """
    {
      "channelSet": [],
      "failedIntegrations": [],
      "media": [],
      "type": "post",
      "content": "fb pic",
      "status": "postnow",
      "businessId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
      "attachments": [
        {
        "_id": "attachments-id-1",
        "contentType": "png",
        "url": "url",
        "createdAt": "*",
        "updatedAt": "*",
        "id": "attachments-id-1"
        }
      ],
      "id": "*"
    }
    """
    And print RabbitMQ exchange "social_folders" message list
    And RabbitMQ exchange "social_folders" should contain following ordered messages:
      """
      [
        {
          "name": "social.folder-action-create-document",
          "payload": {
            "esFolderItemPrototype": {
              "_id": "*",
              "attachments": [
                {
                "_id": "attachments-id-1",
                "contentType": "png",
                "url": "url",
                "createdAt": "*",
                "updatedAt": "*",
                "id": "attachments-id-1"
                }
              ],
              "businessId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
              "channelSet": [],
              "content": "fb pic",
              "media": [],
              "postedAt": "*",
              "serviceEntityId": "{{response._id}}",
              "status": "postnow",
              "type": "post",
              "parentFolderId": null,
              "sortDate": "*"
            }
          }
        }
      ]
      """

  Scenario: schedule a post
    Given I use DB fixture "post"
    When I send a POST request to "/business/{{businessId}}/post/media-post?post=%7B%22channelSet%22%3A%5B%2235fcb0f5-b404-420e-bb3a-67b2fe82c12a%22%5D%2C%22content%22%3A%22hello%22%2C%22parentFolderId%22%3Anull%2C%22productId%22%3A%5B%5D%2C%22status%22%3A%22schedule%22%2C%22toBePostedAt%22%3A%222023-03-03T07%3A33%3A00.000Z%22%2C%22type%22%3A%22media%22%7D" with form data:
    |||
    Then print last response
    And the response status code should be 200
    And store a response as "response"
    And the response should contain json:
      """
      {
        "channelSet": [],
        "failedIntegrations": [],
        "media": [],
        "type": "media",
        "content": "hello",
        "status": "schedule",
        "businessId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
        "sentStatus": "Sent",
        "toBePostedAt": "2023-03-03T07:33:00.000Z",
        "attachments": [],
        "id": "*"
      }
      """
    And print RabbitMQ exchange "async_events" message list
    And RabbitMQ exchange "async_events" should contain following ordered messages:
      """
      [
        {
          "name": "social.event.post.created",
          "payload": {
            "channelSet": [],
            "failedIntegrations": [],
            "media": [],
            "productId": [],
            "content": "hello",
            "status": "schedule",
            "toBePostedAt": "2023-03-03T07:33:00.000Z",
            "type": "media",
            "businessId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
            "mediaType": "",
            "sentStatus": "Sent",
            "attachments": [],
            "postState": [],
            "createdAt": "*",
            "updatedAt": "*",
            "id": "*"
          }
        }
      ]
      """

  Scenario: create post using media-post api with empty content
    Given I use DB fixture "post"
    When I send a POST request to "/business/{{businessId}}/post/media-post?post=%7B%22channelSet%22%3A%5B%2235fcb0f5-b404-420e-bb3a-67b2fe82c12a%22%5D%2C%22content%22%3A%22%22%2C%22parentFolderId%22%3Anull%2C%22productId%22%3A%5B%5D%2C%22status%22%3A%22schedule%22%2C%22toBePostedAt%22%3A%222023-03-03T07%3A33%3A00.000Z%22%2C%22type%22%3A%22media%22%7D" with form data:
    |||
    Then print last response
    And the response status code should be 400
    And store a response as "response"
    And the response should contain json:
      """
      {
        "errors":[
            {
              "target":{
                  "channelSet":[
                    "35fcb0f5-b404-420e-bb3a-67b2fe82c12a"
                  ],
                  "content":"",
                  "parentFolderId":null,
                  "productId":[

                  ],
                  "status":"schedule",
                  "toBePostedAt":"2023-03-03T07:33:00.000Z",
                  "type":"media"
              },
              "value":"",
              "property":"content",
              "children":[

              ],
              "constraints":{
                  "isNotEmpty":"content should not be empty"
              }
            }
        ],
        "message":"Validation failed",
        "statusCode":400
      }
      """

  Scenario: create post using media-post api with parent folder
    Given I use DB fixture "post"
    When I send a POST request to "/business/{{businessId}}/post/media-post?post=%7B%22type%22%3A%22post%22%2C%22content%22%3A%22fb%20video%22%2C%22mediaType%22%3A%20%22image%22%2C%22channelSet%22%3A%5B%2235fcb0f5-b404-420e-bb3a-67b2fe82c12a%22%5D%2C%22status%22%3A%22postnow%22%2C%22parentFolderId%22%3A%22another-folder-id%22%7D" with form data:
    |||
    Then print last response
    And the response status code should be 200
    And store a response as "response"
    And RabbitMQ exchange "social_folders" should contain following ordered messages:
      """
      [
        {
          "name": "social.folder-action-create-document",
          "payload": {
            "esFolderItemPrototype": {
              "_id": "*",
              "attachments": [],
              "businessId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
              "channelSet": [],
              "content": "fb video",
              "media": [],
              "postedAt": "*",
              "sentStatus": "Sent",
              "serviceEntityId": "{{response._id}}",
              "status": "postnow",
              "type": "post",
              "parentFolderId": "another-folder-id",
              "sortDate": "*"
            }
          }
        }
      ]
      """

  Scenario: get posts
    Given I use DB fixture "post"
    When I send a GET request to "/business/{{businessId}}/post"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
      [{
        "businessId": "{{businessId}}",
        "content": "*",
        "media": "*",
        "postedAt": "*",
        "status": "postnow",
        "title": "*",
        "type": "post",
        "_id": "*"
      }]
    """

  Scenario: delete posts
    Given I use DB fixture "post"
    When I send a DELETE request to "/business/{{businessId}}/post/{{postId}}"
    Then print last response
    And the response status code should be 200
    And model "Post" with id "{{postId}}" should not contain json:
      """
      {
        "businessId": "{{businessId}}"
      }
      """

  Scenario: get post by id
    Given I use DB fixture "post"
    When I send a GET request to "/business/{{businessId}}/post/{{postId}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
      {
        "businessId": "{{businessId}}",
        "_id": "{{postId}}"
      }
    """

  Scenario: Update post
    Given I use DB fixture "post"
    When I send a PATCH request to "/business/{{businessId}}/post/{{postId}}" with json:
      """
      {
        "content": "content",
        "media": "media",
        "channelSet": [],
        "postedAt": "2021-07-19T06:29:20.820Z",
        "status": "postnow",
        "title": "title",
        "type": "post"
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
      {
        "businessId": "{{businessId}}",
        "content": "content",
        "media": "media",
        "postedAt": "2021-07-19T06:29:20.820Z",
        "status": "postnow",
        "title": "title",
        "type": "post",
        "_id": "{{postId}}"
      }
    """
    And store a response as "response"
    And model "Post" with id "{{postId}}" should contain json:
      """
      {
        "content": "content",
        "media": "media",
        "postedAt": "2021-07-19T06:29:20.820Z",
        "status": "postnow",
        "title": "title",
        "type": "post"
      }
      """

  Scenario: Update post (update array fields)
    Given I use DB fixture "post"
    When I send a PATCH request to "/business/{{BUSINESS_ID}}/post/{{POST_ID_3}}" with json:
      """
      {
        "content": "content",
        "status": "postnow",
        "type": "post",
        "channelSet": [],
        "attachments": [
          {
            "_id": "attachments-id-2",
            "contentType": "jpg",
            "url": "url-2"
          }
        ],
        "media": [
          "new-media-1",
          "new-media-2"
        ],
        "productId": [
          "new-product-1",
          "new-product-2"
        ]
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "_id": "{{POST_ID_3}}",
        "businessId": "{{BUSINESS_ID}}",
        "attachments": [
          {
            "_id": "attachments-id-2",
            "contentType": "jpg",
            "url": "url-2"
          }
        ],
        "media": [
          "new-media-1",
          "new-media-2"
        ],
        "productId": [
          "new-product-1",
          "new-product-2"
        ]
      }
      """
    And model "Post" with id "{{POST_ID_3}}" should contain json:
      """
      {
        "attachments": [
          {
            "_id": "attachments-id-2",
            "contentType": "jpg",
            "url": "url-2"
          }
        ],
        "media": [
          "new-media-1",
          "new-media-2"
        ],
        "productId": [
          "new-product-1",
          "new-product-2"
        ]
      }
      """
    And model "Post" with id "{{POST_ID_3}}" should not contain json:
      """
      {
        "attachments": [
          {
            "_id": "attachments-id-1"
          }
        ]
      }
      """

    And model "Post" with id "{{POST_ID_3}}" should not contain json:
      """
      {
        "productId": [
          "product-1"
        ]
      }
      """
    And model "Post" with id "{{POST_ID_3}}" should not contain json:
      """
      {
        "media": [
          "media-1"
        ]
      }
      """

  Scenario: update post using update-media api with empty content
    Given I use DB fixture "post"
    When I send a PATCH request to "/business/{{businessId}}/post/update-media-post/{{postId}}?post=%7B%22type%22%3A%22post%22%2C%22content%22%3A%22%22%2C%22mediaType%22%3A%22image%22%2C%22channelSet%22%3A%5B%2235fcb0f5-b404-420e-bb3a-67b2fe82c12a%22%5D%2C%22status%22%3A%22postnow%22%7D" with form data:
    |||
    Then print last response
    And the response status code should be 400
    And store a response as "response"
    And the response should contain json:
    """
      {
        "errors": [
          {
            "target": {
              "type": "post",
              "content": "",
              "mediaType": "image",
              "channelSet": [
                "35fcb0f5-b404-420e-bb3a-67b2fe82c12a"
              ],
              "status": "postnow"
            },
            "value": "",
            "property": "content",
            "children": [],
            "constraints": {
              "isNotEmpty": "content should not be empty"
            }
          }
        ],
        "message": "Validation failed",
        "statusCode": 400
      }
    """

  Scenario: update post using update-media api
    Given I use DB fixture "post"
    When I send a PATCH request to "/business/{{businessId}}/post/update-media-post/{{postId}}?post=%7B%22type%22%3A%22post%22%2C%22content%22%3A%22fb%20video%22%2C%22mediaType%22%3A%20%22image%22%2C%22channelSet%22%3A%5B%2235fcb0f5-b404-420e-bb3a-67b2fe82c12a%22%5D%2C%22status%22%3A%22postnow%22%7D" with form data:
    |||
    Then print last response
    And the response status code should be 200
    And store a response as "response"
    And the response should contain json:
    """
    {
      "channelSet": [],
      "failedIntegrations": [],
      "media": ["*"],
      "type": "post",
      "content": "fb video",
      "status": "postnow",
      "businessId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
      "sentStatus": "Sent",
      "attachments": [],
      "id": "*"
    }
    """
    And print RabbitMQ exchange "social_folders" message list
    And RabbitMQ exchange "social_folders" should contain following ordered messages:
      """
      [
        {
          "name": "social.folder-action-update-document",
           "payload": {
             "esFolderItemPrototype": {
               "_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
               "attachments": [],
               "businessId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
               "channelSet": [],
               "media": [
                 "media"
               ],
               "postedAt": "*",
               "sentStatus": "Sent",
               "serviceEntityId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
               "status": "postnow",
               "title": "title",
               "type": "post"
             }
           }
        }
      ]
      """
