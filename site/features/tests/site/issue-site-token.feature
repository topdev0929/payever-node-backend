Feature: Issue site tokens
  Background:
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    And I remember as "anotherBusinessId" following value:
      """
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    And I remember as "shopId" following value:
      """
      "cccccccc-cccc-cccc-cccc-cccccccccccc"
      """
    And I remember as "channelSetId" following value:
      """
      "dddddddd-dddd-dddd-dddd-dddddddddddd"
      """
    And I remember as "defaultShopId" following value:
      """
      "ffffffff-ffff-ffff-ffff-ffffffffffff"
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

  Scenario: issue site token, not restricted with password
    Given I use DB fixture "sites/update-site"
    When I send a POST request to "/api/business/{{businessId}}/site/access/{{shopId}}/create-token" with json:
      """
      {
        "password": "123"
      }
      """
    Then print last response
    And the response status code should be 201

  Scenario: issue site token, not restricted with password, wrong password
    Given I use DB fixture "sites/issue-token"
    When I send a POST request to "/api/business/{{businessId}}/site/access/{{shopId}}/create-token" with json:
      """
      {
        "password": "wrong-password"
      }
      """
    Then print last response
    And the response status code should be 403

  Scenario: issue site token, not restricted with password, wrong business
    Given I use DB fixture "sites/issue-token"
    When I send a POST request to "/api/business/{{anotherBusinessId}}/site/access/{{shopId}}/create-token" with json:
      """
      {
        "password": "123"
      }
      """
    Then print last response
    And the response status code should be 403

  Scenario: issue site token
    Given I use DB fixture "sites/issue-token"
    When I send a POST request to "/api/business/{{businessId}}/site/access/{{shopId}}/create-token" with json:
      """
      {
        "password": "123"
      }
      """
    Then print last response
    And the response status code should be 201
    And the response should contain json:
      """
      {
        "accessToken": "*"
      }
      """
