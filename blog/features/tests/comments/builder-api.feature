Feature: Builder API comments
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
    When I send a POST request to "/api/business/blog/comments/create-comment" with json:
    """
    {
        "businessId": "{{businessId}}",
        "blogId": "{{blogId}}",
        "author": "test",
        "content": "comment text"
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
    When I send a POST request to "/api/business/blog/comments/get-comments" with json:
    """
    {
        "blogId": "{{blogIdTwo}}"
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
