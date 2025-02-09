Feature: Business delete
  Background:
    And I remember as "businessId" following value:
      """
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    And I remember as "blogId" following value:
      """
      "11111111-1111-1111-1111-111111111111"
      """
    And I remember as "blogIdTwo" following value:
      """
      "cccccccc-cccc-cccc-cccc-cccccccccccc"
      """
    And I remember as "pageId" following value:
      """
      "aaaaaaaa-aaaa-aaaa-1234-aaaaaaaaaaaa"
      """
    And I authenticate as a user with the following data:
    """
    {
      "email": "email@test.com",
      "roles": [{
        "name": "merchant",
        "permissions": [{"businessId": "{{businessId}}", "acls": []}, {"businessId": "{{businessId}}", "acls": []}]
      },{
        "name": "user",
        "permissions": []
      }]
    }
    """

  Scenario: Create comment
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
    And I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [

         ],
        "result": {}
      }
      """

    When I send a POST request to "/api/integration/builder/blogCreateComment" with json:
    """
    {
        "businessId": "{{businessId}}",
        "contextId": "{{blogId}}",
        "data": {
            "author": "test",
            "content": "comment text"
        }
    }
    """
    Then print last response
    And the response status code should be 201

  Scenario: Get comments
    Given I use DB fixture "blog/create-blog-default-exists"
    Given I use DB fixture "comment/create-comment"
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
    When I send a POST request to "/api/integration/builder/blogGetComments" with json:
    """
    {
        "contextId": "{{blogIdTwo}}"
    }
    """
    Then print last response
    And the response status code should be 201
    And the response should contain json:
    """
    [
      {
        "content": "test"
      }
    ]
    """

  Scenario: Create blog page
    Given I use DB fixture "blog-page"
    When I send a POST request to "/api/integration/builder/blogSavePage" with json:
      """
      {
        "contextId": "{{blogId}}",
        "data":
          {
            "author": "author",
            "body": "body",
            "caption": "caption",
            "description": "description",
            "image": "image",
            "subtitle": "subtitle2",
            "title": "title2",
            "pageId": "{{pageId}}"
          }
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
        "pageId": "{{pageId}}",
        "_id": "*"
      }
      """

  Scenario: get blog page
    Given I use DB fixture "blog-page"
    When I send a POST request to "/api/integration/builder/blogGetPage" with json:
    """
    {
      "contextId": "{{blogId}}",
      "data":   {
          "pageId": "{{pageId}}"
      }
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
        "subtitle": "subtitle",
        "title": "title",
        "pageId": "{{pageId}}",
        "_id": "*"
      }
      """

  Scenario: get blog pages
    Given I use DB fixture "blog-page"
    When I send a POST request to "/api/integration/builder/blogGetPages" with json:
    """
    {
      "contextId": "{{blogId}}",
      "data":   {
          "pageId": "{{pageId}}"
      }
    }
    """
    Then print last response
    And the response status code should be 201
    And the response should contain json:
    """
    [
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
    ]
    """

  Scenario: remove blog page
    Given I use DB fixture "blog-page"
    When I send a POST request to "/api/integration/builder/blogDeletePage" with json:
    """
    {
      "contextId": "{{blogId}}",
      "data":   {
          "pageId": "{{pageId}}"
      }
    }
    """
    Then print last response
    And the response status code should be 201
