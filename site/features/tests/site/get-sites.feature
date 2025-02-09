Feature: Get business sites list
  Background:
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    And I remember as "anotherBusinessId" following value:
      """
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    And I remember as "siteId1" following value:
      """
      "11111111-1111-1111-1111-111111111111"
      """
    And I remember as "siteId2" following value:
      """
      "22222222-2222-2222-2222-222222222222"
      """
    And I remember as "anotherBusinessShopId" following value:
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

  Scenario: Get sites list
    Given I use DB fixture "sites/get-list"
    When I send a GET request to "/api/business/{{businessId}}/site"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      [
         {
           "id": "{{siteId1}}"
         },
         {
           "id": "{{siteId2}}"
         }
      ]
      """
    And the response should not contain json:
      """
      [
         {
           "id": "{{anotherBusinessShopId}}"
         }
      ]
      """

  Scenario: Get site
    Given I use DB fixture "sites/get-list"
    When I send a GET request to "/api/business/{{businessId}}/site/{{siteId1}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
       {
         "id": "{{siteId1}}"
       }
      """

  Scenario: Get site as anonymous
    Given I use DB fixture "sites/get-list"
    And I am not authenticated
    When I send a GET request to "/api/business/{{businessId}}/site/{{siteId1}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
       {
         "id": "{{siteId1}}"
       }
      """

  Scenario: Get default site
    Given I use DB fixture "sites/get-default-site"
    And I am not authenticated
    When I send a GET request to "/api/business/{{businessId}}/site/default"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
       {
         "id": "{{siteId1}}"
       }
      """
    And the response should not contain json:
      """
      {
        "accessConfig": {
          "privatePassword": "*"
        }
       }
      """

  Scenario: Get isValidName site
    Given I use DB fixture "sites/get-default-site"
    And I am not authenticated
    When I send a GET request to "/api/business/{{businessId}}/site/isValidName?name=name"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
        {
           "result": true
         }
      """

  Scenario: Get isValidName site invalid
    Given I use DB fixture "sites/get-default-site"
    And I am not authenticated
    When I send a GET request to "/api/business/{{businessId}}/site/isValidName"
    Then print last response
    And the response status code should be 400
