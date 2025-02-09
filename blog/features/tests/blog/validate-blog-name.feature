Feature: Validate blog name
  Background:
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    And I remember as "anotherBusinessId" following value:
      """
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
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

  Scenario: Check blog name with valid value
    Given I use DB fixture "blog/create-first-blog"
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
    When I send a GET request to "/api/business/{{businessId}}/blog/isValidName?name=test"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "result": true
      }
      """


  Scenario: Check blog name with occupied name
    Given I use DB fixture "blog/create-blog-occupied-name"
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
    And I remember as "occupiedName" following value:
      """
      "Test Blog"
      """
    When I send a GET request to "/api/business/{{businessId}}/blog/isValidName?name={{occupiedName}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "result": false
      }
      """

  Scenario: Try to check name without param
    Given I use DB fixture "blog/create-blog-occupied-name"
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
    When I send a GET request to "/api/business/{{businessId}}/blog/isValidName"
    Then print last response
    And the response status code should be 400
    And the response should contain json:
      """
      {
        "statusCode": 400,
        "message": "Validation failed"
      }
      """
