Feature: Delete domain
  Background:
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    And I remember as "blogId" following value:
      """
      "cccccccc-cccc-cccc-cccc-cccccccccccc"
      """
    And I remember as "domainId" following value:
      """
      "dddddddd-dddd-dddd-dddd-dddddddddddd"
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

  Scenario: Trying to delete domain
    Given I use DB fixture "domain/delete-domain"
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
    Given I mock "delete" method of ingress client with parameters:
      """
        null
      """
    When I send a DELETE request to "/api/business/{{businessId}}/blog/{{blogId}}/domain/{{domainId}}"
    Then print last response
    And the response status code should be 200
    And model "Domain" with id "{{domainId}}" should not exist
