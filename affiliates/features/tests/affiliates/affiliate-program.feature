Feature: Affiliate program
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
    When I send a POST request to "/api/business/{{businessId}}/affiliates-program" with json:
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
    When I send a GET request to "/api/business/{{businessId}}/affiliates-program"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
      [{
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
      }]
    """

  Scenario: get affiliate programs by branding
    Given I use DB fixture "affiliate-program"
    When I send a GET request to "/api/business/{{businessId}}/affiliates-program/branding/{{affiliateBrandingId}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
      [{
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
        "_id": "*"
      }]
    """

  Scenario: get affiliate program id
    Given I use DB fixture "affiliate-program"
    When I send a GET request to "/api/business/{{businessId}}/affiliates-program/{{affiliateProgramId}}"
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
    When I send a DELETE request to "/api/business/{{businessId}}/affiliates-program/{{affiliateProgramId}}"
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
    When I send a PATCH request to "/api/business/{{businessId}}/affiliates-program/{{affiliateProgramId}}" with json:
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

  Scenario: Get target url
    Given I use DB fixture "affiliate-program"
    When I send a GET request to "/api/business/{{businessId}}/affiliates-program/target-url?affiliateId={{affiliateId}}&affiliateProgramId={{affiliateProgramId}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
      {
       "params": {
          "pe_affiliate_id": "{{affiliateId}}",
          "pe_affiliate_program": "{{affiliateProgramId}}"
        },
        "type": 308,
        "url": "*"
      }
    """

  Scenario: Generate cookie data
    Given I use DB fixture "affiliate-program"
    When I send a GET request to "/api/business/{{businessId}}/affiliates-program/generate-cookie?affiliateId={{affiliateId}}&affiliateProgramId={{affiliateProgramId}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
      {
        "affiliateId": "{{affiliateId}}",
        "affiliateProgramId": "{{affiliateProgramId}}",
        "cookieTime": "*",
        "hash": "*",
        "url": "*"
      }
    """

  Scenario: Get cookie data
    Given I use DB fixture "affiliate-program"
    When I send a GET request to "/api/business/{{businessId}}/affiliates-program/generate-cookie?affiliateId={{affiliateId}}&affiliateProgramId={{affiliateProgramId}}"
    Then print last response
    And the response status code should be 200
    And I store a response as "response"
    And I send a GET request to "/api/business/{{businessId}}/affiliates-program/cookie-data?hash={{response.hash}}"
    Then print last response
    And the response should contain json:
      """
      {
        "affiliateId": "{{affiliateId}}",
        "affiliateProgramId": "{{affiliateProgramId}}",
        "cookieTime": "*",
        "hash": "*",
        "url": "*"
      }
      """


