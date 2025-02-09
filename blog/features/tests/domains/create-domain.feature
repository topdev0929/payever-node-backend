Feature: Create domain
  Background:
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    And I remember as "blogId" following value:
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

  Scenario: Should create domain
    Given I use DB fixture "domain/create-domain"
    Given I mock "delete" method of ingress client with parameters:
      """
        null
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
    When I send a POST request to "/api/business/{{businessId}}/blog/{{blogId}}/domain" with json:
      """
      {
        "name": "default.com"
      }
      """
    Then print last response
    And the response status code should be 201
    And the response should contain json:
      """
      {
        "name": "default.com",
        "isConnected": false,
        "blog": {
          "_id": "{{blogId}}"
        },
        "_id": "*"
      }
      """
