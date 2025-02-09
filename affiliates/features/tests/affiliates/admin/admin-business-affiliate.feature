Feature: Admin business affiliate
  Background:
    Given I remember as "businessAffiliateId" following value:
      """
        "ffffffff-ffff-ffff-ffff-ffffffffffff"  
      """
    Given I remember as "anotherBusinessAffiliateId" following value:
      """
        "ffffffff-ffff-ffff-ffff-fffffffffff2"  
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
            "name":"admin",
            "permissions":[]
          }
        ]
      }
      """

# get business affiliate
# get business affiliates list
# create business affiliate
# delete

  Scenario: Get business affiliate by id
    Given I use DB fixture "business-affiliate/business-affiliate-exists"
    When I send a GET request to "/api/admin/business-affiliates/{{businessAffiliateId}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
      {
        "businessId": "{{businessId}}",
        "_id": "{{businessAffiliateId}}"
      }
    """

  Scenario: Get business affiliate list
    Given I use DB fixture "business-affiliate/business-affiliate-exists"
    When I send a GET request to "/api/admin/business-affiliates"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "documents": [
          {
            "businessId": "{{businessId}}",
            "_id": "{{businessAffiliateId}}"
          }
        ]
      }
      """

  Scenario: Create new affiliate and business affiliate
    Given I use DB fixture "business-affiliate/create-new-affiliate"
    When I send a POST request to "/api/admin/business-affiliates" with json:
      """
      {
        "businessId": "{{businessId}}",
        "affiliate": {
          "firstName": "TestName",
          "lastName": "TestLastName",
          "email": "{{affiliateEmail}}"
        }
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

  Scenario: Update business affiliate
    Given I use DB fixture "business-affiliate/business-affiliate-exists"
    When I send a PATCH request to "/api/admin/business-affiliates/{{businessAffiliateId}}" with json:
      """
      {        
        "businessId": "{{businessId}}",
        "affiliate": {
          "firstName": "first name",
          "lastName": "last name",
          "email": "newemail@payever.org"
        }
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
      {
        "affiliate": {
          "firstName": "first name",
          "lastName": "last name",
          "email": "newemail@payever.org"
        },
        "business": {
          "_id": "{{businessId}}",
          "name": "Test business"
        },
        "_id": "{{businessAffiliateId}}"
      }
    """


 

  Scenario: Create business affiliate with existing affiliate
    Given I use DB fixture "business-affiliate/existing-affiliate"
    When I send a POST request to "/api/admin/business-affiliates" with json:
      """
      {
        "businessId": "{{businessId}}",
        "affiliate": {
          "firstName": "TestName",
          "lastName": "TestLastName",
          "email": "{{affiliateEmail}}"
        }
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
    When I send a POST request to "/api/admin/business-affiliates" with json:
      """
      {
        "affiliate": {
          "firstName": "TestName",
          "lastName": "TestLastName",
          "email": "{{affiliateEmail}}"
        },
        "businessId": "{{businessId}}"
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


  Scenario: Delete business affiliate with existing affiliate
    Given I use DB fixture "business-affiliate/delete-business-affiliate"
    When I send a DELETE request to "/api/admin/business-affiliates/{{businessAffiliateId}}"
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

Scenario: Deny Access for non admin users
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@email.com",
        "roles": [
          {
            "name": "merchant",
            "permissions": []
          }
        ]
      }
      """
    Given I use DB fixture "business-affiliate/delete-business-affiliate"
    When I send a GET request to "/api/admin/business-affiliates"
    Then print last response
    And the response status code should be 403    
