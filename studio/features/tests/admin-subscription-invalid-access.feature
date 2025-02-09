Feature: Subscription media invalid access features
  Background:
    Given I use DB fixture "subscription.media"
    Given I remember as "subscriptionMediaId" following value:
      """
        "7d2a9404-e07a-477f-839d-71f591cf1317"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "id": "{{userId}}",
        "email": "email@test.com",
        "roles": [{
          "name": "merchant",
          "permissions": [{"businessId": "{{businessId}}", "acls": []}]
        }]
      }
      """

  Scenario: Get subscription media pagination
    When I send a GET request to "/api/subscription?limit=3&page=2"
    Then print last response
    Then the response status code should be 403

  Scenario: Get subscription media by id
    When I send a GET request to "/api/subscription/{{subscriptionMediaId}}"
    Then print last response
    Then the response status code should be 403

  Scenario: Get subscription media by type
    When I send a GET request to "/api/subscription/type/free?limit=2&page=1"
    Then print last response
    Then the response status code should be 403

  Scenario: Create subscription media 
    When I send a POST request to "/api/subscription" with json:
      """
      {
        "url":"http://example.com/someimage.png",
        "mediaType": "image",
        "subscriptionType": "free"
      }
      """
    Then print last response
    Then the response status code should be 403

  Scenario: Delete subscription media by id 
    When I send a DELETE request to "/api/subscription/{{subscriptionMediaId}}"
    Then print last response
    Then the response status code should be 403
