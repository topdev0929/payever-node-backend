Feature: Get business blog domain list
  Background:
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    And I remember as "blogId" following value:
      """
      "cccccccc-cccc-cccc-cccc-cccccccccccc"
      """
    And I remember as "domain1" following value:
      """
      "11111111-1111-1111-1111-111111111111"
      """
    And I remember as "domain2" following value:
      """
      "22222222-2222-2222-2222-222222222222"
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

   Scenario: Get blog domain list
     Given I use DB fixture "domain/get-list"
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
     When I send a GET request to "/api/business/{{businessId}}/blog/{{blogId}}/domain"
     Then print last response
     And the response status code should be 200
     And the response should contain json:
       """
       [
          {
            "_id": "{{domain1}}"
          },
          {
            "_id": "{{domain2}}"
          }
       ]
       """
      And the response should not contain json:
       """
       [
          {
            "id": "{{anotherBusinessBlogId}}"
          }
       ]
       """


   Scenario: Get blog by-domain
     Given I use DB fixture "domain/by-domain"
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
     When I send a GET request to "/api/blog/by-domain?domain=test.domain.1"
     Then print last response
     And the response status code should be 200
