Feature: Admin affiliate program
  Background:
    Given I remember as "businessId" following value:
      """
        "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "affiliateBrandingId" following value:
      """
        "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaac"
      """
    Given I remember as "affiliateId" following value:
      """
        "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    Given I remember as "affiliateProgramId" following value:
      """
        "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaap"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@email.com",
        "roles": [
          {
            "name":"admin",
            "permissions":[]
          },
          {
            "name": "merchant",
            "permissions": []
          }
        ]
      }
      """
    Given I mock Elasticsearch method "deleteByQuery" with:
      """
      { "arguments": ["affiliate-program-folder"], "result": [] }
      """
    Given I mock Elasticsearch method "singleIndex" with:
      """
      { "arguments": ["affiliate-program-folder"], "result": [] }
      """
    Given I mock Elasticsearch method "search" with:
      """
      { "arguments": ["affiliate-program-folder"], "result": [] }
      """

  Scenario: Create new affiliate program
    Given I use DB fixture "affiliate-program"
    When I send a POST request to "/api/admin/affiliate-programs" with json:
      """
      {
        "assets": 0,
        "commissionType": "%",
        "cookie": 11,
        "currency": "USD",
        "categories": [],
        "defaultCommission": 4,
        "inviteLink": "test",
        "appliesTo": "ALL_PRODUCTS",
        "name": "name",
        "programApi": "api",
        "startedAt": "2021-07-12T12:11:50.533Z",
        "status": "active",
        "commission": [],
        "products": [],
        "url": "url.com",
        "businessId":"{{businessId}}"
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
      {
        "business": "{{businessId}}",
        "assets": 0,
        "commissionType": "%",
        "cookie": 11,
        "currency": "USD",
        "name": "name",
        "programApi": "api",
        "startedAt": "2021-07-12T12:11:50.533Z",
        "status": "active",
        "commission": [],
        "products": [],
        "url": "url.com",
        "_id": "*"
      }
    """
    And store a response as "response"
    And model "AffiliateProgram" with id "{{response._id}}" should contain json:
      """
      {
        "assets": 0,
        "commissionType": "%",
        "currency": "USD",
        "name": "name",
        "programApi": "api",
        "startedAt": "2021-07-12T12:11:50.533Z",
        "status": "active",
        "commission": [],
        "products": [],
        "url": "url.com"
      }
      """

  Scenario: get affiliate programs
    Given I use DB fixture "affiliate-program"
    When I send a GET request to "/api/admin/affiliate-programs"
    Then print last response
    And the response status code should be 200
    And the response should contain json:

      """
      {
        "documents": [
          {
            "business": "{{businessId}}",
            "assets": 0,
            "commissionType": "*",
            "cookie": "*",
            "currency": "*",
            "name": "*",
            "programApi": "*",
            "startedAt": "*",
            "status": "*",
            "commission": [],
            "products": [],
            "url": "*",
            "_id": "*"
          }
        ]
      }
      """

  Scenario: get affiliate program id
    Given I use DB fixture "affiliate-program"
    When I send a GET request to "/api/admin/affiliate-programs/{{affiliateProgramId}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
      {
        "business": "{{businessId}}",
        "affiliateBranding": "{{affiliateBrandingId}}",
        "assets": 0,
        "commissionType": "*",
        "cookie": "*",
        "currency": "*",
        "name": "*",
        "programApi": "*",
        "startedAt": "*",
        "status": "*",
        "commission": [],
        "products": [],
        "url": "*",
        "_id": "{{affiliateProgramId}}"
      }
    """

  Scenario: delete affiliate programs
    Given I use DB fixture "affiliate-program"
    When I send a DELETE request to "/api/admin/affiliate-programs/{{affiliateProgramId}}"
    Then print last response
    And the response status code should be 200
    And model "AffiliateProgram" with id "{{affiliateProgramId}}" should not contain json:
      """
      {
        "business": "{{businessId}}"
      }
      """

  Scenario: Update affiliate program
    Given I use DB fixture "affiliate-program"
    When I send a PATCH request to "/api/admin/affiliate-programs/{{affiliateProgramId}}" with json:
      """
      {
        "assets": 0,
        "commissionType": "%",
        "name": "name",
        "cookie": 11,
        "currency": "USD",
        "categories": [],
        "defaultCommission": 4,
        "inviteLink": "test",
        "appliesTo": "ALL_PRODUCTS",
        "programApi": "api",
        "startedAt": "2021-07-12T12:11:50.533Z",
        "status": "active",
        "commission": [],
        "products": [],
        "url": "url.com"
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
      {
        "business": "{{businessId}}",
        "assets": 0,
        "commissionType": "%",
        "currency": "USD",
        "name": "name",
        "programApi": "api",
        "startedAt": "2021-07-12T12:11:50.533Z",
        "status": "active",
        "commission": [],
        "products": [],
        "url": "url.com",
        "_id": "{{affiliateProgramId}}"
      }
    """
    And store a response as "response"
    And model "AffiliateProgram" with id "{{affiliateProgramId}}" should contain json:
      """
      {
        "assets": 0,
        "commissionType": "%",
        "cookie": 11,
        "currency": "USD",
        "name": "name",
        "programApi": "api",
        "startedAt": "2021-07-12T12:11:50.533Z",
        "status": "active",
        "commission": [],
        "products": [],
        "url": "url.com"
      }
      """

  
