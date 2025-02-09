Feature: blog page
  Background:
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    And I remember as "pageId" following value:
      """
      "aaaaaaaa-aaaa-aaaa-1234-aaaaaaaaaaaa"
      """
    And I remember as "blogId" following value:
      """
      "11111111-1111-1111-1111-111111111111"
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

  Scenario: Create blog page
    Given I use DB fixture "blog-page"
    When I send a POST request to "/api/business/{{anotherBusinessId}}/blog/{{blogId}}/page/{{pageId}}-2" with json:
      """
      {
        "author": "author",
        "body": "body",
        "caption": "caption",
        "description": "description",
        "image": "image",
        "subtitle": "subtitle2",
        "title": "title2"
      }
      """
    Then print last response
    And the response status code should be 201
    And the response should contain json:
      """
      {
        "author": "author",
        "body": "body",
        "caption": "caption",
        "description": "description",
        "image": "image",
        "subtitle": "subtitle2",
        "title": "title2",
        "pageId": "{{pageId}}-2",
        "_id": "*"
      }
      """
    And print RabbitMQ message list
    And RabbitMQ exchange "async_events" should contain following ordered messages:
    """
    [
      {
        "name": "blog.event.blog.page.created",
        "payload": {
          "blogId": "*",
          "blogPage": {
            "_id": "*"
          }
        }
      }
    ]
    """

  Scenario: get blog page
    Given I use DB fixture "blog-page"
    When I send a GET request to "/api/business/{{anotherBusinessId}}/blog/{{blogId}}/page/{{pageId}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "author": "author",
        "body": "body",
        "caption": "caption",
        "description": "description",
        "image": "image",
        "subtitle": "subtitle",
        "title": "title",
        "pageId": "{{pageId}}",
        "_id": "*"
      }
      """

  Scenario: get blog pages
    Given I use DB fixture "blog-page"
    When I send a GET request to "/api/business/{{anotherBusinessId}}/blog/{{blogId}}/page"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      [{
        "author": "author",
        "body": "body",
        "caption": "caption",
        "description": "description",
        "image": "image",
        "subtitle": "subtitle",
        "title": "title",
        "pageId": "{{pageId}}",
        "_id": "*"
      }]
      """

  Scenario: remove blog page
    Given I use DB fixture "blog-page"
    When I send a DELETE request to "/api/business/{{anotherBusinessId}}/blog/{{blogId}}/page/{{pageId}}"
    Then print last response
    And the response status code should be 200
    And print RabbitMQ message list
    And RabbitMQ exchange "async_events" should contain following ordered messages:
    """
    [
      {
        "name": "blog.event.blog.page.removed",
        "payload": {
          "blogId": "*",
          "blogPage": {
            "_id": "*"
          }
        }
      }
    ]
    """

  Scenario: update blog page
    Given I use DB fixture "blog-page"
    When I send a PATCH request to "/api/business/{{anotherBusinessId}}/blog/{{blogId}}/page/{{pageId}}" with json:
      """
      {
        "author": "author",
        "body": "body",
        "caption": "caption",
        "description": "description",
        "image": "image",
        "subtitle": "subtitle2",
        "title": "title3"
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "author": "author",
        "body": "body",
        "caption": "caption",
        "description": "description",
        "image": "image",
        "subtitle": "subtitle2",
        "title": "title3",
        "pageId": "{{pageId}}",
        "_id": "*"
      }
      """
    And print RabbitMQ message list
    And RabbitMQ exchange "async_events" should contain following ordered messages:
    """
    [
      {
        "name": "blog.event.blog.page.updated",
        "payload": {
          "blogId": "*",
          "blogPage": {
            "_id": "*"
          }
        }
      }
    ]
    """
