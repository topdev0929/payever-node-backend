Feature: Delete business affiliate
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
    Given I remember as "businessAffiliateId" following value:
      """
        "ffffffff-ffff-ffff-ffff-ffffffffffff"
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

  Scenario: Delete business affiliate with existing affiliate
    Given I use DB fixture "business-affiliate/delete-business-affiliate"
    When I send a DELETE request to "/api/business/{{businessId}}/affiliates/{{businessAffiliateId}}"
    Then print last response
    And the response status code should be 200
    And model "BusinessAffiliate" with id "{{businessAffiliateId}}" should not exist
    And print RabbitMQ message list
    And RabbitMQ exchange "async_events" should contain following ordered messages:
    """
    [
       {
         "name": "affiliate.event.business-affiliate.deleted",
         "payload": {
           "id": "{{businessAffiliateId}}",
           "affiliate": {
             "id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
           }
         }
       }
     ]

    """

  Scenario: Delete business affiliate with existing affiliate
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@email.com",
        "roles": [
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "{{anotherBusinessId}}",
                "acls": []
              }
            ]
          }
        ]
      }
      """
    Given I use DB fixture "business-affiliate/delete-business-affiliate"
    When I send a DELETE request to "/api/business/{{anotherBusinessId}}/affiliates/{{businessAffiliateId}}"
    Then print last response
    And the response status code should be 403
