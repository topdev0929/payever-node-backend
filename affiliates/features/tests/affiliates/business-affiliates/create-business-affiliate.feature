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
    Given I use DB fixture "business-affiliate/create-new-affiliate"
    When I send a POST request to "/api/business/{{businessId}}/affiliates" with json:
      """
      {
        "firstName": "TestName",
        "lastName": "TestLastName",
        "email": "{{affiliateEmail}}"
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
      {
        "affiliate": {
          "firstName": "TestName",
          "lastName": "TestLastName",
          "email": "{{affiliateEmail}}"
        },
        "business": {
          "_id": "{{businessId}}",
          "name": "Test business"
        },
        "_id": "*"
      }
    """
    And store a response as "response"
    And model "Affiliate" with id "{{response.affiliate._id}}" should contain json:
      """
      {
        "email": "{{affiliateEmail}}"
      }
      """
    And I look for model "Affiliate" by following JSON and remember as "createdAffiliate":
      """
      {
        "email": "{{affiliateEmail}}"
      }
      """
    And model "BusinessAffiliate" with id "{{response._id}}" should contain json:
      """
      {
        "affiliate": "{{createdAffiliate._id}}",
        "businessId": "{{businessId}}"
      }
      """
    And print RabbitMQ message list
    And RabbitMQ exchange "async_events" should contain following ordered messages:
    """
    [
       {
         "name": "affiliate.event.business-affiliate.created",
         "payload": {
           "id": "{{response._id}}",
           "affiliate": {
             "id": "{{response.affiliate._id}}",
             "email": "{{affiliateEmail}}",
             "firstName": "TestName"
           },
           "business": {
             "id": "{{businessId}}"
           }
         }
       }
     ]
    """

  Scenario: Create business affiliate with existing affiliate
    Given I use DB fixture "business-affiliate/existing-affiliate"
    When I send a POST request to "/api/business/{{businessId}}/affiliates" with json:
      """
      {
        "firstName": "TestName",
        "lastName": "TestLastName",
        "email": "{{affiliateEmail}}"
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
        {
          "affiliate": {
            "_id": "{{affiliateId}}",
            "email": "{{affiliateEmail}}"
          },
          "business": {
            "_id": "{{businessId}}",
            "name": "Test business"
          },
          "_id": "*"
        }
      """
    And store a response as "response"
    And model "BusinessAffiliate" with id "{{response._id}}" should contain json:
      """
      {
        "affiliate": "{{affiliateId}}",
        "businessId": "{{businessId}}"
      }
      """
    And print RabbitMQ message list
    And RabbitMQ exchange "async_events" should contain following ordered messages:
    """
    [
       {
         "name": "affiliate.event.business-affiliate.created",
         "payload": {
           "id": "{{response._id}}",
           "affiliate": {
             "id": "{{affiliateId}}",
             "email": "{{affiliateEmail}}",
             "firstName": "*"
           }
         }
       }
     ]
    """

  Scenario: Trying to create duplicated business affiliate
    Given I use DB fixture "business-affiliate/business-affiliate-exists"
    When I send a POST request to "/api/business/{{businessId}}/affiliates" with json:
      """
      {
        "firstName": "TestName",
        "lastName": "TestLastName",
        "email": "{{affiliateEmail}}"
      }
      """
    Then print last response
    And the response status code should be 400
    And the response should contain json:
      """
        {
          "statusCode": 400,
          "message": "Validation failed",
          "errors": "Business affiliate \"{{affiliateEmail}}\" already exists"
        }
      """

  Scenario: Creating business affiliate for another business
    Given I use DB fixture "business-affiliate/create-new-affiliate"
    When I send a POST request to "/api/business/{{anotherBusinessId}}/affiliates" with json:
      """
      {
        "firstName": "TestName",
        "lastName": "TestLastName",
        "email": "{{affiliateEmail}}"
      }
      """
    Then print last response
    And the response status code should be 403
