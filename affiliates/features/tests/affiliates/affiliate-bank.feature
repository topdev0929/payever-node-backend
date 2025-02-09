Feature: Affiliate bank
  Background:
    Given I remember as "businessId" following value:
      """
        "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "affiliateId" following value:
      """
        "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    Given I remember as "affiliateBankId" following value:
      """
        "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab"
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

  Scenario: Create new affiliate bank
    Given I use DB fixture "affiliate-bank"
    When I send a POST request to "/api/business/{{businessId}}/affiliates-bank" with json:
      """
      {
        "accountHolder": "account_holder",
        "accountNumber": "account_number", 
        "bankName": "bank_name", 
        "city": "city",  
        "country": "country"
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
      {
        "business": "{{businessId}}",
        "accountHolder": "account_holder",
        "accountNumber": "account_number", 
        "bankName": "bank_name", 
        "city": "city",  
        "country": "country",
        "_id": "*"
      }
    """
    And store a response as "response"
    And model "AffiliateBank" with id "{{response._id}}" should contain json:
      """
      {
        "accountHolder": "account_holder",
        "accountNumber": "account_number"
      }
      """

  Scenario: get affiliate banks
    Given I use DB fixture "affiliate-bank"
    When I send a GET request to "/api/business/{{businessId}}/affiliates-bank"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
      [{
        "business": "{{businessId}}",
        "accountHolder": "*",
        "accountNumber": "*", 
        "bankName": "*", 
        "city": "*",  
        "country": "*",
        "_id": "*"
      }]
    """

  Scenario: delete affiliate banks
    Given I use DB fixture "affiliate-bank"
    When I send a DELETE request to "/api/business/{{businessId}}/affiliates-bank/{{affiliateBankId}}"
    Then print last response
    And the response status code should be 200
    And model "AffiliateBank" with id "{{affiliateBankId}}" should not contain json:
      """
      {
        "business": "{{businessId}}"
      }
      """

  Scenario: Update affiliate bank
    Given I use DB fixture "affiliate-bank"
    When I send a PATCH request to "/api/business/{{businessId}}/affiliates-bank/{{affiliateBankId}}" with json:
      """
      {
        "accountHolder": "account_holder",
        "accountNumber": "account_number", 
        "bankName": "bank_name", 
        "city": "city",  
        "country": "country"
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
      {
        "business": "{{businessId}}",
        "accountHolder": "account_holder",
        "accountNumber": "account_number", 
        "bankName": "bank_name", 
        "city": "city",  
        "country": "country",
        "_id": "{{affiliateBankId}}"
      }
    """
    And store a response as "response"
    And model "AffiliateBank" with id "{{affiliateBankId}}" should contain json:
      """
      {
        "accountHolder": "account_holder",
        "accountNumber": "account_number"
      }
      """
