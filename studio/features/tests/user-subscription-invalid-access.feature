Feature: User media features
  Background:
    Given I use DB fixture "business"
    Given I use DB fixture "subscription.media"
    Given I remember as "businessId" following value:
      """
        "08d30292-0b3c-4b5d-a6ec-93ba43d6c81d"
      """
    Given I remember as "subscriptionMediaId" following value:
      """
        "a0a82e19-4574-4ffa-82be-e3e5d1e60d9b"
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

  Scenario: Get subscription media by id invalid access
    When I send a GET request to "/api/{{businessId}}/subscription/{{subscriptionMediaId}}"
    Then print last response
    Then the response status code should be 404

  Scenario: Search subscribed media for user without name querystring
    Given I get file "features/data/search-bad-request.response.json" content and remember as "response" with placeholders
    When I send a GET request to "/api/{{businessId}}/subscription/search?page=1&limit=3"
    Then print last response
    Then the response status code should be 400
    And the response should contain json:
      """
      {{response}}
      """
