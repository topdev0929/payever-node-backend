Feature: Get business blog list
  Background:
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    And I remember as "anotherBusinessId" following value:
      """
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
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
    When I send a GET request to "/api/business/{{businessId}}/blog"
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

  Scenario: Get blog
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
    When I send a GET request to "/api/business/{{businessId}}/blog/{{blogId1}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
       {
         "_id": "{{blogId1}}"
       }
      """

  Scenario: Get blog as anonymous
    Given I use DB fixture "blog/get-list"
    And I am not authenticated
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
    When I send a GET request to "/api/business/{{businessId}}/blog/{{blogId1}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
       {
         "_id": "{{blogId1}}"
       }
      """
