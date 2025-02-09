Feature: Update domain
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

  Scenario: Update domain, change name
    Given I use DB fixture "domain/update-domain"
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
    When I send a PATCH request to "/api/business/{{businessId}}/blog/{{blogId}}/domain/{{domainId}}" with json:
      """
      {
        "name": "new.domain"
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "name": "new.domain"
      }
      """
