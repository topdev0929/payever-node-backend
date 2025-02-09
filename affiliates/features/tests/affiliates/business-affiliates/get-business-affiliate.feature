Feature: Create business affiliate
  Background:
    Given I mock Elasticsearch method "bulkIndex" with:
      """
      { "arguments": ["business-affiliate-folder", []], "result": [] }
      """
    Given I mock Elasticsearch method "singleIndex" with:
      """
      { "arguments": ["business-affiliate-folder"], "result": [] }
      """
    Given I mock Elasticsearch method "search" with:
      """
      { "arguments": ["business-affiliate-folder"], "result": [] }
      """
    Given I mock Elasticsearch method "deleteByQuery" with:
      """
      { "arguments": ["business-affiliate-folder"], "result": [] }
      """
    Given I remember as "businessId" following value:
      """
        "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "affiliateId" following value:
      """
        "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    Given I remember as "anotherBusinessId" following value:
      """
        "cccccccc-cccc-cccc-cccc-cccccccccccc"
      """
    Given I remember as "affiliateEmail" following value:
      """
        "affiliate@test.com"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@email.com",
        "roles": [
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "{{businessId}}",
                "acls": []
              }
            ]
          }
        ]
      }
      """

  Scenario: Create new affiliate and business affiliate
    Given I use DB fixture "business-affiliate/existing-affiliate"
    When I send a GET request to "/api/business/{{businessId}}/affiliates"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
      {

      }
    """

  Scenario: Get business affiliate by affiliateId
    Given I use DB fixture "business-affiliate/business-affiliate-exists"
    When I send a GET request to "/api/business/{{businessId}}/affiliates/{{affiliateId}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
      {
        "businessId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
        "affiliate": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      }
    """

  Scenario: Creating business affiliate for another business
    Given I use DB fixture "business-affiliate/create-new-affiliate"
    When I send a GET request to "/api/business/{{anotherBusinessId}}/affiliates"
    Then print last response
    And the response status code should be 403
